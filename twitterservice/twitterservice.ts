///<reference path="../models/geolocation.ts" />
declare function require(name:string);
declare var process: any;

var geocoderProvider = 'google';
var httpAdapter = 'http';
var Twitter = require('twitter');
var GeoCoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var Moment = require('moment');
var _ = require('lodash');
import geolocation from "../models/geolocation";
import repository from "../repository/repository";
import tweetdatamodel from "../models/tweetdatamodel";
import tweetviewmodel from "../models/tweetviewmodel";
export class twitterservice {
    client: any;
    params: any;
    querystring: any;
    geocoder : any;
    repository: any;
    cb: any;
    constructor(){
        this.client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });
        this.params = {};
        this.querystring = 'search/tweets/';
        this.geocoder = GeoCoder;
        this.repository = new repository();
    }
    getTweetsAroundLocation(geolocation, distance){

        if(geolocation.name != ""){

            this.geocoder.geocode(geolocation.name).then((results) => {

                var coords = results[0];

                this.params = {
                    screen_name: 'nodejs',
                    geocode: coords.latitude + ',' + coords.longitude + ',' + distance + 'mi'
                };

                this.client.get(this.querystring, this.params, (error, tweets, response) => {

                    // console.log(error);
                    // console.log(tweets);
                    // console.log(response);

                    if (!error) {
                        //console.log(tweets);
                        this.cb(tweets);
                    }
                });

            });


        }
        else{
            this.params = {
                screen_name : 'nodejs',
                geocode : geolocation.latitude + ',' + geolocation.longitude + ',' + distance + 'mi'
            };
            this.client.get(this.querystring, this.params, function(error, tweets, response){
                if (!error) {
                    this.cb(tweets);
                }
            });
        }


    }

    // getTweets2(cb) {
    //
    //     var allTweets = [];
    //
    //     var locations = [
    //        // { latitude: 53.483959, longitude: -2.244644},
    //         //{ latitude: 51.4545, longitude: 2.5879 },
    //         { latitude: 52.4862, longitude: 1.8904 }
    //         ];
    //
    //     for (var index = 0; index < locations.length; index++) {
    //
    //         var obj = locations[index];
    //         var params = {
    //             screen_name : 'nodejs',
    //             geocode : obj.latitude + ',' + obj.longitude + ',' + 10 + 'mi'
    //         };
    //
    //         this.client.get(this.querystring, params, (error, tweets, response) => {
    //             //allTweets.push(tweets);
    //
    //             //console.log(tweets);
    //
    //             //if(index === locations.length) {
    //                 cb(tweets)
    //             //}
    //         });
    //
    //     }

    
    getTweetsBySearchTerm(search, cb) {        
            
        console.log(search);

        this.client.get(this.querystring, { screen_name: 'nodejs', q: search }, (error, tweets, response) => {

            console.log(error);

            cb(tweets)

        });
    }
    
    getTweetsByLocation(location, cb) {        
            
        console.log(location);

        this.client.get(this.querystring, { screen_name: 'nodejs', geocode : location.lat + ',' + location.lon + ',' + 10 + 'mi'}, (error, tweets, response) => {   

            console.log(error);

            cb(tweets)
                        
        }); 
        
    }

    getTweets(callback){
        //TODO will get from DB in reality, but set up to do it in real time initially.

        // if(this.isApiUpdateRequired()){
        //     this.updateDbWithNewTweets();
        // }
        this.cb = callback;

        //TODO put keys into config file or similar?

        //TODO change this to getTweetsFromDatabase
        
        this.getTweetsFromApiAndConvertToViewModel();
    }
    getTweetsFromApiAndConvertToViewModel(){
        var data = this.getTweetsFromApi();

        return this.convertTweetsToViewModel(data);

    }
    getTweetsFromApiAndConvertToDataModel(){
        var tweets = this.getTweetsFromApi();
        return this.convertTweetsToDataModel(tweets);
    }
    convertTweetsToViewModel(tweets){
        //console.log(tweets);
        //var parsed = JSON.parse(tweets); //is this needed?? does it come through as json objects already?
        var results = _.map(tweets, this.convertEachTweetToViewModel);

        return results;
    }
    convertEachTweetToViewModel(tweet){
        return new tweetviewmodel(
            tweet.text,
            tweet.entities.media.media_url, //TODO change this
            new geolocation(tweet.coordinates[1], tweet.coordinates[0], ''),
            tweet.when
        );
    }
    convertTweetsToDataModel(tweets){
        var parsed = JSON.parse(tweets); //is this needed?? does it come through as json objects already?
        var results = _.map(parsed, this.convertEachTweetToDataModel);

        return results;
    }
    convertEachTweetToDataModel(tweet){
        return new tweetdatamodel(tweet, null, null, null);
    }
    getTweetsFromDatabase(){
        return this.repository.getTweets();
    }
    getTweetsFromApi() : any{

        this.getTweetsAroundLocation(new geolocation(0,0,'Manchester'), 10);

        // return {
        //     'manchester': this.getTweetsAroundLocation(new geolocation(0,0,'Manchester'), 10),
        //     'bristol': this.getTweetsAroundLocation(new geolocation(0,0,'Bristol'), 10),
        //     'birmingham': this.getTweetsAroundLocation(new geolocation(0,0,'Birmingham'), 10),
        //     'edinburgh': this.getTweetsAroundLocation(new geolocation(0,0,'Edinburgh'), 10),
        //     'london':this.getTweetsAroundLocation(new geolocation(0,0,'London'), 10)
        // };
    }
    isApiUpdateRequired(){
        var lastApiCallDate = this.repository.getLastApiCallDate();
        var now = Moment();
        var lastCall = Moment(lastApiCallDate);
        var diffMinutes = now.diff(lastCall, 'minutes');
        if(diffMinutes > 2){
            return true;
        }
        return false;
    }
    updateDbWithNewTweets(){
        var tweetsFromApi = this.getTweetsFromApiAndConvertToDataModel();
        return ;

        //this.getTweetsFromApiAndConvertToViewModel();

    }
}

var TwitterService = new twitterservice();

export default TwitterService;

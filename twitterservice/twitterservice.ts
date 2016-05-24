///<reference path="../models/geolocation.ts" />
declare function require(name:string);
var geocoderProvider = 'google';
var httpAdapter = 'http';
var Twitter = require('twitter');
var GeoCoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var Moment = require('moment');
var Lodash = require('lodash');
var ObjectID = require('mongodb').ObjectID;
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
    constructor(){
        this.client = new Twitter({
          consumer_key: 'eUrQiF8aIzmciweik1R391P0x',
          consumer_secret: 'Ivvr3aWsoIcZguORoi5masZIpI25P7uhByIYJ04nB09b80Jwzn',
          access_token_key: '1419001915-tjtKTbNqYp0pNPU2pzhjTvW2qJ3I7S73f1zeHHr',
          access_token_secret: 'w1wEcUu35vmuaP4VeqO3M6RLtX8AEonQ5neTy0THQvwZp'
        });
        this.params = {};
        this.querystring = 'search/tweets/q=*';
        this.geocoder = new GeoCoder();
        this.repository = new repository();
    }
    getTweetsAroundLocation(geolocation, distance){
        if(geolocation.name != ""){
            var coords = this.getCoordsFromName(geolocation.name);
            this.params = {
                screen_name: 'nodejs',
                geocode: coords.latitude + ',' + coords.longitude + ',' + distance + 'mi'
            };
        }
        else{
            this.params = {
                screen_name : 'nodejs',
                geocode : geolocation.latitude + ',' + geolocation.longitude + ',' + distance + 'mi'
            };
        }

        return this.client.get(this.querystring, this.params, function(error, tweets, response){
            if (!error) {
                return tweets;
            }
        });
    }
    getCoordsFromName(name){
        var geoinfo = this.geocoder.geocode(name);
        return new geolocation(
            geoinfo.latitude,
            geoinfo.longitude,
            ''
        );
    }
    getTweets(){
        //TODO will get from DB in reality, but set up to do it in real time initially.

        // if(this.isApiUpdateRequired()){
        //     this.updateDbWithNewTweets();
        // }

        //TODO put keys into config file or similar?

        //TODO change this to getTweetsFromDatabase
        return this.getTweetsFromApiAndConvertToViewModel();
    }
    getTweetsFromApiAndConvertToViewModel(){
        var tweets = this.getTweetsFromApi();
        return this.convertTweetsToViewModel(tweets)
    }
    getTweetsFromApiAndConvertToDataModel(){
        var tweets = this.getTweetsFromApi();
        return this.convertTweetsToDataModel(tweets);
    }
    convertTweetsToViewModel(tweets){
        var parsed = JSON.parse(tweets); //is this needed?? does it come through as json objects already?
        var results = Lodash.map(parsed, this.convertEachTweetToViewModel);

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
        var results = Lodash.map(parsed, this.convertEachTweetToDataModel);

        return results;
    }
    convertEachTweetToDataModel(tweet){
        return new tweetdatamodel(tweet, null, null, null);
    }
    getTweetsFromDatabase(){
        return this.repository.getTweets();
    }
    getTweetsFromApi(){
        return {
            'manchester': this.getTweetsAroundLocation(new geolocation(0,0,'Manchester'), 10),
            'bristol': this.getTweetsAroundLocation(new geolocation(0,0,'Bristol'), 10),
            'birmingham': this.getTweetsAroundLocation(new geolocation(0,0,'Birmingham'), 10),
            'edinburgh': this.getTweetsAroundLocation(new geolocation(0,0,'Edinburgh'), 10),
            'london':this.getTweetsAroundLocation(new geolocation(0,0,'London'), 10)
        };
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
    }
}

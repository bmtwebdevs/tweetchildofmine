///<reference path="../models/geolocation.ts" />
declare function require(name:string);
var geocoderProvider = 'google';
var httpAdapter = 'http';
var Twitter = require('twitter');
var GeoCoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var Moment = require('moment');
var _ = require('lodash');
//var ObjectID = require('mongodb').ObjectID;
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
          consumer_key: 'eUrQiF8aIzmciweik1R391P0x',
          consumer_secret: 'Ivvr3aWsoIcZguORoi5masZIpI25P7uhByIYJ04nB09b80Jwzn',
          access_token_key: '1419001915-tjtKTbNqYp0pNPU2pzhjTvW2qJ3I7S73f1zeHHr',
          access_token_secret: 'w1wEcUu35vmuaP4VeqO3M6RLtX8AEonQ5neTy0THQvwZp'
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
    
    getTweets2(search, cb) {        
            
        console.log(search);

        this.client.get(this.querystring, { screen_name: 'nodejs', q: search }, (error, tweets, response) => {   

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
        //this.getTweetsFromApiAndConvertToViewModel();
    }
}

var TwitterService = new twitterservice();

export default TwitterService;

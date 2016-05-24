///<reference path="../models/geolocation.ts" />
declare function require(name:string);
var geocoderProvider = 'google';
var httpAdapter = 'http';
var Twitter = require('twitter');
var GeoCoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var Moment = require('moment');
import geolocation from "../models/geolocation";
import repository from "../repository/repository";

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
        var geoinfo = this.geocoder.geocoder(name);
        return new geolocation(
            geoinfo.latitude,
            geoinfo.longitude,
            ''
        );
    }
    getTweets(){
        if(this.isApiUpdateRequired()){
            
        }
        //TODO if set amount of time has passed, get from twitter and update database, otherwise get from database

        //TODO put keys into config file or similar?

        //TODO have last api call date in database

        return {
            'manchester': this.getTweetsAroundLocation(new geolocation(0,0,'Manchester'), 10),
            'bristol': this.getTweetsAroundLocation(new geolocation(0,0,'Bristol'), 10),
            'birmingham': this.getTweetsAroundLocation(new geolocation(0,0,'Birmingham'), 10),
            'edinburgh': this.getTweetsAroundLocation(new geolocation(0,0,'Edinburgh'), 10),
            'london':this.getTweetsAroundLocation(new geolocation(0,0,'London'), 10)
        };
    }
    getTweetsFromDatabase(){
        //TODO Get this to go to the database and return the tweets
        return
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
                if(diffMinutes > 20){
                    return true;
                }
                return false;
    }
}

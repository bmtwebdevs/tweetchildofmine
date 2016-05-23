///<reference path="../models/geolocation.ts" />
declare function require(name:string);
var geocoderProvider = 'google';
var httpAdapter = 'http';
var Twitter = require('twitter');
var GeoCoder = require('node-geocoder')(geocoderProvider, httpAdapter);
import geolocation from "../models/geolocation";

export class twitterservice {
    client: any;
    params: any;
    querystring: any;
    geocoder : any;
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
            geoinfo.longitude
        );
    }
}

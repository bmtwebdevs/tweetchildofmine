var geocoderProvider = 'google';
var httpAdapter = 'http';
var Twitter = require('twitter');
var GeoCoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var Moment = require('moment');
const geolocation_1 = require("../models/geolocation");
const repository_1 = require("../repository/repository");
export class twitterservice {
    constructor() {
        this.client = new Twitter({
            consumer_key: 'eUrQiF8aIzmciweik1R391P0x',
            consumer_secret: 'Ivvr3aWsoIcZguORoi5masZIpI25P7uhByIYJ04nB09b80Jwzn',
            access_token_key: '1419001915-tjtKTbNqYp0pNPU2pzhjTvW2qJ3I7S73f1zeHHr',
            access_token_secret: 'w1wEcUu35vmuaP4VeqO3M6RLtX8AEonQ5neTy0THQvwZp'
        });
        this.params = {};
        this.querystring = 'search/tweets/q=*';
        this.geocoder = new GeoCoder();
        this.repository = new repository_1.default();
    }
    getTweetsAroundLocation(geolocation, distance) {
        if (geolocation.name != "") {
            var coords = this.getCoordsFromName(geolocation.name);
            this.params = {
                screen_name: 'nodejs',
                geocode: coords.latitude + ',' + coords.longitude + ',' + distance + 'mi'
            };
        }
        else {
            this.params = {
                screen_name: 'nodejs',
                geocode: geolocation.latitude + ',' + geolocation.longitude + ',' + distance + 'mi'
            };
        }
        return this.client.get(this.querystring, this.params, function (error, tweets, response) {
            if (!error) {
                return tweets;
            }
        });
    }
    getCoordsFromName(name) {
        var geoinfo = this.geocoder.geocoder(name);
        return new geolocation(geoinfo.latitude, geoinfo.longitude, '');
    }
    getTweets() {
        if (this.isApiUpdateRequired()) {
        }
        return {
            'manchester': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'Manchester'), 10),
            'bristol': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'Bristol'), 10),
            'birmingham': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'Birmingham'), 10),
            'edinburgh': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'Edinburgh'), 10),
            'london': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'London'), 10)
        };
    }
    getTweetsFromDatabase() {
        return;
    }
    getTweetsFromApi() {
        return {
            'manchester': this.getTweetsAroundLocation(new geolocation(0, 0, 'Manchester'), 10),
            'bristol': this.getTweetsAroundLocation(new geolocation(0, 0, 'Bristol'), 10),
            'birmingham': this.getTweetsAroundLocation(new geolocation(0, 0, 'Birmingham'), 10),
            'edinburgh': this.getTweetsAroundLocation(new geolocation(0, 0, 'Edinburgh'), 10),
            'london': this.getTweetsAroundLocation(new geolocation(0, 0, 'London'), 10)
        };
    }
    isApiUpdateRequired() {
        var lastApiCallDate = this.repository.getLastApiCallDate();
        var now = Moment();
        var lastCall = Moment(lastApiCallDate);
        var diffMinutes = now.diff(lastCall, 'minutes');
        if (diffMinutes > 20) {
            return true;
        }
        return false;
    }
}

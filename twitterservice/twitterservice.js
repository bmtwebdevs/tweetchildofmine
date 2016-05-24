"use strict";
var geocoderProvider = 'google';
var httpAdapter = 'http';
var Twitter = require('twitter');
var GeoCoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var Moment = require('moment');
var Lodash = require('lodash');
var geolocation_1 = require("../models/geolocation");
var repository_1 = require("../repository/repository");
var tweetdatamodel_1 = require("../models/tweetdatamodel");
var twitterservice = (function () {
    function twitterservice() {
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
    twitterservice.prototype.getTweetsAroundLocation = function (geolocation, distance) {
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
    };
    twitterservice.prototype.getCoordsFromName = function (name) {
        var geoinfo = this.geocoder.geocoder(name);
        return new geolocation_1.default(geoinfo.latitude, geoinfo.longitude, '');
    };
    twitterservice.prototype.getTweets = function () {
        var tweets = this.getTweetsFromApi();
        return this.convertTweetsToModel(tweets);
    };
    twitterservice.prototype.convertTweetsToModel = function (tweets) {
        var parsed = JSON.parse(tweets);
        var results = Lodash.map(parsed, this.convertEachTweetToModel);
        return results;
    };
    twitterservice.prototype.convertEachTweetToModel = function (tweet) {
        return new tweetdatamodel_1.default(tweet.text, tweet.photo, new geolocation_1.default(tweet.coordinates[1], tweet.coordinates[0], ''), tweet.when);
    };
    twitterservice.prototype.getTweetsFromDatabase = function () {
        return this.repository.getTweets();
    };
    twitterservice.prototype.getTweetsFromApi = function () {
        return {
            'manchester': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'Manchester'), 10),
            'bristol': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'Bristol'), 10),
            'birmingham': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'Birmingham'), 10),
            'edinburgh': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'Edinburgh'), 10),
            'london': this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'London'), 10)
        };
    };
    twitterservice.prototype.isApiUpdateRequired = function () {
        var lastApiCallDate = this.repository.getLastApiCallDate();
        var now = Moment();
        var lastCall = Moment(lastApiCallDate);
        var diffMinutes = now.diff(lastCall, 'minutes');
        if (diffMinutes > 2) {
            return true;
        }
        return false;
    };
    twitterservice.prototype.updateDbWithNewTweets = function () {
        return;
    };
    return twitterservice;
}());
exports.twitterservice = twitterservice;

"use strict";
var geocoderProvider = 'google';
var httpAdapter = 'http';
var Twitter = require('twitter');
var GeoCoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var Moment = require('moment');
var _ = require('lodash');
var geolocation_1 = require("../models/geolocation");
var repository_1 = require("../repository/repository");
var tweetdatamodel_1 = require("../models/tweetdatamodel");
var tweetviewmodel_1 = require("../models/tweetviewmodel");
var twitterservice = (function () {
    function twitterservice() {
        this.client = new Twitter({
            consumer_key: 'eUrQiF8aIzmciweik1R391P0x',
            consumer_secret: 'Ivvr3aWsoIcZguORoi5masZIpI25P7uhByIYJ04nB09b80Jwzn',
            access_token_key: '1419001915-tjtKTbNqYp0pNPU2pzhjTvW2qJ3I7S73f1zeHHr',
            access_token_secret: 'w1wEcUu35vmuaP4VeqO3M6RLtX8AEonQ5neTy0THQvwZp'
        });
        this.params = {};
        this.querystring = 'search/tweets/';
        this.geocoder = GeoCoder;
        this.repository = new repository_1.default();
    }
    twitterservice.prototype.getTweetsAroundLocation = function (geolocation, distance) {
        var _this = this;
        if (geolocation.name != "") {
            this.geocoder.geocode(geolocation.name).then(function (results) {
                var coords = results[0];
                _this.params = {
                    screen_name: 'nodejs',
                    geocode: coords.latitude + ',' + coords.longitude + ',' + distance + 'mi'
                };
                _this.client.get(_this.querystring, _this.params, function (error, tweets, response) {
                    if (!error) {
                        _this.cb(tweets);
                    }
                });
            });
        }
        else {
            this.params = {
                screen_name: 'nodejs',
                geocode: geolocation.latitude + ',' + geolocation.longitude + ',' + distance + 'mi'
            };
            this.client.get(this.querystring, this.params, function (error, tweets, response) {
                if (!error) {
                    this.cb(tweets);
                }
            });
        }
    };
    twitterservice.prototype.getTweets2 = function (location, cb) {
        var params = {
            screen_name: 'nodejs',
            geocode: location.lat + ',' + location.lon + ',' + 10 + 'mi'
        };
        this.client.get(this.querystring, params, function (error, tweets, response) {
            cb(tweets);
        });
    };
    twitterservice.prototype.getTweets = function (callback) {
        this.cb = callback;
        this.getTweetsFromApiAndConvertToViewModel();
    };
    twitterservice.prototype.getTweetsFromApiAndConvertToViewModel = function () {
        var data = this.getTweetsFromApi();
        return this.convertTweetsToViewModel(data);
    };
    twitterservice.prototype.getTweetsFromApiAndConvertToDataModel = function () {
        var tweets = this.getTweetsFromApi();
        return this.convertTweetsToDataModel(tweets);
    };
    twitterservice.prototype.convertTweetsToViewModel = function (tweets) {
        var results = _.map(tweets, this.convertEachTweetToViewModel);
        return results;
    };
    twitterservice.prototype.convertEachTweetToViewModel = function (tweet) {
        return new tweetviewmodel_1.default(tweet.text, tweet.entities.media.media_url, new geolocation_1.default(tweet.coordinates[1], tweet.coordinates[0], ''), tweet.when);
    };
    twitterservice.prototype.convertTweetsToDataModel = function (tweets) {
        var parsed = JSON.parse(tweets);
        var results = _.map(parsed, this.convertEachTweetToDataModel);
        return results;
    };
    twitterservice.prototype.convertEachTweetToDataModel = function (tweet) {
        return new tweetdatamodel_1.default(tweet, null, null, null);
    };
    twitterservice.prototype.getTweetsFromDatabase = function () {
        return this.repository.getTweets();
    };
    twitterservice.prototype.getTweetsFromApi = function () {
        this.getTweetsAroundLocation(new geolocation_1.default(0, 0, 'Manchester'), 10);
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
        var tweetsFromApi = this.getTweetsFromApiAndConvertToDataModel();
        return;
    };
    return twitterservice;
}());
exports.twitterservice = twitterservice;
var TwitterService = new twitterservice();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TwitterService;

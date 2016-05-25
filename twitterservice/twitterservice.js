"use strict";
var geocoderProvider = 'google';
var httpAdapter = 'http';
var Twitter = require('twitter');
var GeoCoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var Moment = require('moment');
var _ = require('lodash');
var repository_1 = require("../repository/repository");
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
    twitterservice.prototype.getTweets2 = function (search, cb) {
        console.log(search);
        this.client.get(this.querystring, { screen_name: 'nodejs', q: search }, function (error, tweets, response) {
            console.log(error);
            cb(tweets);
        });
    };
    twitterservice.prototype.getTweets = function (callback) {
        this.cb = callback;
    };
    return twitterservice;
}());
exports.twitterservice = twitterservice;
var TwitterService = new twitterservice();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TwitterService;

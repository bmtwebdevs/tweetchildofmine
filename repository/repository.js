"use strict";
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/tweets';
var ObjectId = require('mongodb').ObjectID;
var repository = (function () {
    function repository() {
    }
    repository.prototype.getLastApiCallDate = function () {
    };
    repository.prototype.getTweets = function () {
    };
    repository.prototype.addTweets = function (tweets) {
        MongoClient.connect(url, tweets, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server.");
            assert.equal(null, err);
            this.insertDocuments(db, tweets, function () {
                db.close();
            });
        });
    };
    repository.prototype.insertDocuments = function (db, tweets, callback) {
        db.collection('tweets').insertMany(tweets, function (err, result) {
            assert.equal(err, null);
            console.log("Inserted a document into the restaurants collection.");
            callback();
        });
    };
    ;
    return repository;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = repository;

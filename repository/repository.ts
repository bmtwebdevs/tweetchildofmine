declare function require(name:string);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/tweets';
var ObjectId = require('mongodb').ObjectID;

export default class repository{
    getLastApiCallDate(){
        //TODO should return a date string with the relevant information in it
    }
    getTweets(){
        //TODO return tweets from DB
    }
    addTweets(tweets){
        MongoClient.connect(url, tweets, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server.");
            assert.equal(null, err);
            this.insertDocuments(db, tweets, function () {
               db.close();
            });

        });
    }
    insertDocuments(db, tweets, callback) {
        db.collection('tweets').insertMany(tweets, function (err, result) {
            assert.equal(err, null);
            console.log("Inserted a document into the restaurants collection.");
            callback();
        });
    };
}

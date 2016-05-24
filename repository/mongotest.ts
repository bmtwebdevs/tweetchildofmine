var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/tweets';


var ObjectId = require('mongodb').ObjectID;

var insertDocument = function (db, callback) {
    db.collection('restaurants').insertOne({
        "address" : {
            "street" : "2 Avenue",
            "zipcode" : "10075",
            "building" : "1480",
            "coord" : [-73.9557413, 40.7720266]
        },
        "borough" : "Manhattan",
        "cuisine" : "Italian",
        "grades" : [
            {
                "date" : new Date("2014-10-01T00:00:00Z"),
                "grade" : "A",
                "score" : 11
            },
            {
                "date" : new Date("2014-01-16T00:00:00Z"),
                "grade" : "B",
                "score" : 17
            }
        ],
        "name" : "Vella",
        "restaurant_id" : "41704620"
    }, function (err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback();
    });
};

var insertDocuments = function (db, callback) {
    db.collection('restaurants').insertMany([{
        "address" : {
            "street" : "2 Avenue",
            "zipcode" : "10075",
            "building" : "1480",
            "coord" : [-73.9557413, 40.7720266]
        },
        "borough" : "Manhattan",
        "cuisine" : "Italian",
        "grades" : [
            {
                "date" : new Date("2014-10-01T00:00:00Z"),
                "grade" : "A",
                "score" : 11
            },
            {
                "date" : new Date("2014-01-16T00:00:00Z"),
                "grade" : "B",
                "score" : 17
            }
        ],
        "name" : "Vella2",
        "restaurant_id" : "41704620"
    }, {
            "address" : {
                "street" : "2 Avenue",
                "zipcode" : "10075",
                "building" : "1480",
                "coord" : [-73.9557413, 40.7720266]
            },
            "borough" : "Manhattan",
            "cuisine" : "Italian",
            "grades" : [
                {
                    "date" : new Date("2014-10-01T00:00:00Z"),
                    "grade" : "A",
                    "score" : 11
                },
                {
                    "date" : new Date("2014-01-16T00:00:00Z"),
                    "grade" : "B",
                    "score" : 17
                }
            ],
            "name" : "Vella3",
            "restaurant_id" : "41704620"
        }
    ]
    , function (err, result) {
        assert.equal(err, null);
        console.log("Inserted 2 documents into the restaurants collection.");
        callback();
    });
};

var findRestaurants = function (db, callback) {
    //{ $or: [{ "cuisine": "Italian" }, { "address.zipcode": "10075" }] }
    //example of a compound query (this list) or this(item) which is sorted by two different fields
    var cursor = db.collection('restaurants').find({
        $or: [{
                "cuisine": "Italian",
                "address.zipcode": "10075",
                "grades.score": { $gt: 20 }
            },
            { "grades.score": { $gt: 90 } }]
    }).sort({
        "borough": 1,
        "cuisine": 1
    });
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};


var updateRestaurants = function (db, callback) {
    db.collection('restaurants').updateOne(
        { "name" : "Juni" },
      {
            $set: { "cuisine": "BBQ" },
            $currentDate: { "lastModified": true }
        }, function (err, results) {
            console.log(results);
            callback();
        });
};


var findRestaurant = function (db,restaurantName, callback) {
    //{ $or: [{ "cuisine": "Italian" }, { "address.zipcode": "10075" }] }
    //example of a compound query (this list) or this(item) which is sorted by two different fields
    var cursor = db.collection('restaurants').find({name: restaurantName});
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};


/*
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    assert.equal(null, err);
    insertDocuments(db, function () {
        db.close();
    });


});

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    assert.equal(null, err);
    insertDocument(db, function () {
       db.close();
    });

});


MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    findRestaurants(db, function () {
        db.close();
    });
});*/

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);

    updateRestaurants(db, function () {
        db.close();
    });
});

MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    findRestaurant(db,"Bocca", function () {
        db.close();
    });
});

import express from 'express';
import path from 'path';
import http from 'http';
import sse from "server-sent-events";
import _ from 'lodash';
import sentiment from 'sentiment';
import ts from '../../twitterservice/twitterservice';
import * as TextAnalyser from '../../textanalyser/textanalyser';
import Face from '../../recognizerator/face.js';
var face = new Face();
import Twitter from 'twitter';

var app = express();
app.server = http.createServer(app);

var client = new Twitter({
	consumer_key: 'N0gsQmkH7fo4o8xsTlKdgGsGg',
	consumer_secret: 'SiZkybWx3rLFpQTLS6vo58hbWoudbJuPY74Z8sVgSUKRr8Tg42',
	access_token_key: '7448232-k6YoNE0GOgzKyMTdgqqFlwtxCpVPIwu9KwDYpafrah',
	access_token_secret: '2dP0QODvSP3QanY7xrcSe0WqsMenjE6p6ClHtndVbliUp'
});

// routes
app.get('/', (req, res) => {
	
	
		
	res.sendFile(path.normalize(__dirname + './../../web/index.html'));	
});

app.use(express.static(path.normalize(__dirname + './../../web/')));


// app.get('/get-tweets-mock', (req, res) => {
// 	
// 	var analyser = new TextAnalyser();		
// 	
// 	res.json(analyser.processTweets());
// 	
// });
// 
app.get('/tweet-stream', sse, (req, res) => {
	
	var stream = client.stream('statuses/filter', {track: 'bristol'});
        
	stream.on('data', function(tweet) {
		
		processTweet(tweet, function(processedTweet) {
			res.sse('data:' + JSON.stringify(processedTweet) + '\n\n');	
		});
	});
 
	stream.on('error', function(error) {
		throw error;
	});		
	
});

app.get('/get-tweets', sse, (req, res) => {
	
	var lat = req.query.latitude;
	var lon = req.query.longitude;
	
	var processedTweets = [];
	
	
	var params = {
		screen_name : 'nodejs',
		geocode : lat + ',' + lon + ',' + 10 + 'mi'
	};
                                        
	// this.client.get(this.querystring, params, (error, tweets, response) => {
	// 	_(tweets.statuses).forEach((tweet) => {		
	// 		var processedTweet = JSON.stringify(processTweet(tweet));
	// 		res.sse('data: ' + processedTweet + '\n\n');			
	// 	});
	// });				
});

function processTweet(tweet, cb) {
	
	//console.log(tweet);	
	var tweetModel = {};
	tweetModel.userName = tweet.user.name;
	tweetModel.when = tweet.created_at;
	tweetModel.text = tweet.text;
	tweetModel.location = tweet.user.location;
	
	// text processing
	tweetModel.textScore = sentiment(tweet.text).score;
	
	// face processing		
	if(tweet.entities.media && tweet.entities.media[0].url) {
		tweetModel.url = tweet.entities.media[0].url;
		tweetModel.media_url = tweet.entities.media[0].media_url
		face.analyseMyFaceFromUrl(tweet.entities.media[0].media_url, function(result) {    	
			console.log(result.statusText, result.emotion);
			
			tweetModel.faceScore = result.emotion;
			cb(tweetModel);
		});
	} else {	
		cb(tweetModel);
	}		
}

// create server
var port = process.env.PORT || 5000;

app.listen(port, () => {
   console.log("Listening on " + port);
});


import express from 'express';
import path from 'path';
import http from 'http';
import _ from 'lodash';
import sentiment from 'sentiment';
import ts from '../../twitterservice/twitterservice';
import * as TextAnalyser from '../../textanalyser/textanalyser';
import Face from '../../recognizerator/face.js';
var face = new Face();

var app = express();
app.server = http.createServer(app);

// routes
app.get('/', (req, res) => {
	
	ts.getTweets2(function(tweets) {
		// for each tweets
		// 	ProcessingInstruction
		// 	WScript
		// 	
		// goto line 13		
	});
		
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
app.get('/get-tweets', (req, res) => {
	
	var lat = req.query.latitude;
	var lon = req.query.longitude;
	
	var processedTweets = [];
	
	var location = {
		lat: lat,
		lon: lon
	};
						
	ts.getTweets2(location, (tweets) => {			
		_(tweets.statuses).forEach((tweet) => {		
			processedTweets.push(processTweet(tweet));			
		});	
		res.json(processedTweets);								
	});			
	
		
});

function processTweet(tweet) {
	
	//console.log(tweet);
	
	var tweetModel = {};
	
	tweetModel.when = tweet.created_at;
	tweetModel.text = tweet.text;
	
	// text processing
	tweetModel.textScore = sentiment(tweet.text).score;
	
	// face processing		
	if(tweet.entities.media && tweet.entities.media[0].url) {		
		face.analyseMyFaceFromUrl(tweet.entities.media[0].url, function(result) {    	
			//console.log(result.statusText, result.emotion);
			tweetModel.url = tweet.entities.media[0].url;
			tweetModel.faceScore = result.emotion;
			return tweetModel;
		});
	} else {	
		return tweetModel;
	}		
}
// 
// app.get('/get-db', (req, res) => {	
// 		
// });

// create server
var port = process.env.PORT || 5000;

app.listen(port, () => {
   console.log("Listening on " + port);
});


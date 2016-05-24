import express from 'express';
import path from 'path';
import http from 'http';
import _ from 'lodash';
import sentiment from 'sentiment';
import ts from '../../twitterservice/twitterservice';
import * as TextAnalyser from '../../textanalyser/textanalyser';
var Face = require('./recognizerator/face.js');
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
	
	var processedTweets = [];
						
	ts.getTweets2((tweets) => {	
		
		_(tweets.statuses).forEach((tweet) => {		
			processedTweets.push(processTweet(tweet));			
		});
						
		res.json(processedTweets);	
	});				
});

function processTweet(tweet) {
	
	var tweetModel = {};
	
	tweetModel.when = tweet.created_at;
	tweetModel.text = tweet.text;
	
	// text processing
	tweetModel.textScore = sentiment(tweet.text).score;
	
	// face.analyseMyFaceFromUrl(tweet.url, function(result) {    	
    // 	console.log(result.statusText, result.emotion);
	// });
	// 
	// // face processing
	// tweetModel.faceScore = 0;
	
	return tweetModel;
	
	
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


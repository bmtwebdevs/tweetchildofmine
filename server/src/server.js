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
<<<<<<< HEAD
	consumer_key: 'N0gsQmkH7fo4o8xsTlKdgGsGg',
	consumer_secret: 'SiZkybWx3rLFpQTLS6vo58hbWoudbJuPY74Z8sVgSUKRr8Tg42',
	access_token_key: '7448232-k6YoNE0GOgzKyMTdgqqFlwtxCpVPIwu9KwDYpafrah',
	access_token_secret: '2dP0QODvSP3QanY7xrcSe0WqsMenjE6p6ClHtndVbliUp'
=======
	consumer_key: 'CKMFkWRso9BXQ68NYR8ODjHHG',
	consumer_secret: 'x04MYu3bpcz3yt63pJZuTfmxbBuWl7kdm79Mbu7Mh1wSi14Pts',
	access_token_key: '131168610-cDDxo8FtunKk6cyx7ztN7jQYaI8ztMzhMhfea5k',
	access_token_secret: 'kaHTr5FxRVYToam6YzbazVfq03ZkuvIvKw4swZXM'
>>>>>>> master
});

// routes
app.get('/', (req, res) => {
				
	res.sendFile(path.normalize(__dirname + './../../web/index.html'));	
});

app.use(express.static(path.normalize(__dirname + './../../web/')));

app.get('/tweet-stream', sse, (req, res) => {
	
	// var bath = ['51.3758', '-2.3599'];
	// var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ];
	// var newYork = ['-74,40','-73,41'];
	
	console.log(req.query);
	
	var stream = client.stream('statuses/filter', {track: req.query.search });
        
<<<<<<< HEAD
	stream.on('data', function(tweet) {
		
		processTweet(tweet, function(processedTweet) {
			res.sse('data:' + JSON.stringify(processedTweet) + '\n\n');	
		});
=======
	stream.on('data', function(tweet) {		
		var processedTweet = JSON.stringify(processTweet(tweet));
		res.sse('data:' + processedTweet + '\n\n');		
>>>>>>> master
	});
 
	stream.on('error', function(error) {
		console.log(error);
		//res.json(error);
	});				
	
});

app.get('/get-tweets-by-location', (req, res) => {
	
	var lat = req.query.lat;
	var lon = req.query.lon;	
	
	var processedTweets = [];
						
	ts.getTweetsByLocation({ lat: lat, lon: lon }, (tweets) => {	
		
		_(tweets.statuses).forEach((tweet) => {		
			processedTweets.push(processTweet(tweet));			
		});
						
		res.json(processedTweets);	
	});	                                        			
		
});

app.get('/get-tweets', (req, res) => {
	
	var search = req.query.search;	
	
	var processedTweets = [];
						
	ts.getTweetsBySearchTerm(search, (tweets) => {	
		
		_(tweets.statuses).forEach((tweet) => {		
			processedTweets.push(processTweet(tweet));			
		});
						
		res.json(processedTweets);	
	});	                                        			
		
});

function processTweet(tweet, cb) {
	
	//console.log(tweet);	
	var tweetModel = {};
	tweetModel.userName = tweet.user.name;
	tweetModel.when = tweet.created_at;
	tweetModel.text = tweet.text;
	tweetModel.location = tweet.user.location;
	
	tweetModel.geo = tweet.geo;
	tweetModel.coordinates = tweet.coordinates;
	
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


'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _serverSentEvents = require('server-sent-events');

var _serverSentEvents2 = _interopRequireDefault(_serverSentEvents);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _sentiment = require('sentiment');

var _sentiment2 = _interopRequireDefault(_sentiment);

var _twitterservice = require('../../twitterservice/twitterservice');

var _twitterservice2 = _interopRequireDefault(_twitterservice);

var _textanalyser = require('../../textanalyser/textanalyser');

var TextAnalyser = _interopRequireWildcard(_textanalyser);

var _face = require('../../recognizerator/face.js');

var _face2 = _interopRequireDefault(_face);

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var face = new _face2.default();


var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

var test = '';
var client = new _twitter2.default({
	consumer_key: 'WnZDP58NPuK0C6Q2cJeTN2xNF',
	consumer_secret: 'hAM1KCFF8ELnmTGy5oCxnNf2YYrBE2QsMxFIfszORMt4Q9nAGK',
	access_token_key: '2256885018-BUTo3lPk4FC2rqwt8BQ8yS8MiWF4lknhNmlQFUB',
	access_token_secret: 'mOChAobcfNdlNornATZZa4A35RCW3nf9YAsEGxzEivarm'
});

// routes
app.get('/', function (req, res) {
	res.sendFile(_path2.default.normalize(__dirname + './../../web/index.html'));
});

app.use(_express2.default.static(_path2.default.normalize(__dirname + './../../web/')));

app.get('/tweet-stream', _serverSentEvents2.default, function (req, res) {

	// var bath = ['51.3758', '-2.3599'];
	// var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ];
	// var newYork = ['-74,40','-73,41'];

	console.log(req.query);

	var stream = client.stream('statuses/filter', { track: req.query.search });

	stream.on('data', function (tweet) {
		processTweet(tweet, function (processedTweet) {
			res.sse('data:' + JSON.stringify(processedTweet) + '\n\n');
		});
	});

	stream.on('error', function (error) {
		console.log(error);
	});
});

app.get('/get-tweets-by-location', function (req, res) {

	var lat = req.query.lat;
	var lon = req.query.lon;

	var processedTweets = [];

	_twitterservice2.default.getTweetsByLocation({ lat: lat, lon: lon }, function (tweets) {

		(0, _lodash2.default)(tweets.statuses).forEach(function (tweet) {
			processedTweets.push(processTweet(tweet));
		});

		res.json(processedTweets);
	});
});

app.get('/get-tweets', function (req, res) {

	var search = req.query.search;

	var processedTweets = [];

	_twitterservice2.default.getTweetsBySearchTerm(search, function (tweets) {

		(0, _lodash2.default)(tweets.statuses).forEach(function (tweet) {
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
	tweetModel.textScore = (0, _sentiment2.default)(tweet.text).score;

	// face processing		
	if (tweet.entities.media && tweet.entities.media[0].url) {
		tweetModel.url = tweet.entities.media[0].url;
		tweetModel.media_url = tweet.entities.media[0].media_url;
		face.analyseMyFaceFromUrl(tweet.entities.media[0].media_url, function (result) {
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

app.listen(port, function () {
	console.log("Listening on " + port);
});
//# sourceMappingURL=server.js.map
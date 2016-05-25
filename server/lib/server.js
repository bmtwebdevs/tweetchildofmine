'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

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

var _serverSentEvents = require('server-sent-events');

var _serverSentEvents2 = _interopRequireDefault(_serverSentEvents);

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var face = new _face2.default();


var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

var client = new _twitter2.default({
	consumer_key: 'eUrQiF8aIzmciweik1R391P0x',
	consumer_secret: 'Ivvr3aWsoIcZguORoi5masZIpI25P7uhByIYJ04nB09b80Jwzn',
	access_token_key: '1419001915-tjtKTbNqYp0pNPU2pzhjTvW2qJ3I7S73f1zeHHr',
	access_token_secret: 'w1wEcUu35vmuaP4VeqO3M6RLtX8AEonQ5neTy0THQvwZp'
});

// routes
app.get('/', function (req, res) {

	_twitterservice2.default.getTweets2(function (tweets) {
		// for each tweets
		// 	ProcessingInstruction
		// 	WScript
		// 	
		// goto line 13		
	});

	res.sendFile(_path2.default.normalize(__dirname + './../../web/index.html'));
});

app.use(_express2.default.static(_path2.default.normalize(__dirname + './../../web/')));

app.get('/tweet-stream', sse, function (req, res) {

	var stream = client.stream('statuses/filter', { track: 'javascript' });

	stream.on('data', function (tweet) {

		var processedTweet = processTweet(tweet);

		console.log(processedTweet);

		res.sse('data:' + processedTweet + '\n\n');
	});

	stream.on('error', function (error) {
		throw error;
	});
});

app.get('/get-tweets', function (req, res) {

	var lat = req.query.latitude;
	var lon = req.query.longitude;

	var processedTweets = [];

	var params = {
		screen_name: 'nodejs',
		geocode: lat + ',' + lon + ',' + 10 + 'mi'
	};

	undefined.client.get(undefined.querystring, params, function (error, tweets, response) {

		(0, _lodash2.default)(tweets.statuses).forEach(function (tweet) {
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
	tweetModel.textScore = (0, _sentiment2.default)(tweet.text).score;

	// face processing		
	if (tweet.entities.media && tweet.entities.media[0].url) {
		tweetModel.url = tweet.entities.media[0].url;
		face.analyseMyFaceFromUrl(tweet.entities.media[0].url, function (result) {
			//console.log(result.statusText, result.emotion);

			tweetModel.faceScore = result.emotion;
			return tweetModel;
		});
	} else {
		return tweetModel;
	}
}

// create server
var port = process.env.PORT || 5000;

app.listen(port, function () {
	console.log("Listening on " + port);
});
//# sourceMappingURL=server.js.map
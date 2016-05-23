'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TextAnalyser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sentiment = require('sentiment');

var _sentiment2 = _interopRequireDefault(_sentiment);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tweets = [];

var TextAnalyser = exports.TextAnalyser = function () {
	function TextAnalyser() {
		_classCallCheck(this, TextAnalyser);
	}

	_createClass(TextAnalyser, [{
		key: 'parseFile',
		value: function parseFile(file) {
			var _this = this;

			_fs2.default.createReadStream(file).pipe((0, _csvParse2.default)({ delimiter: ',' }).on('data', function (csvrow) {

				var tweetText = csvrow[5];

				var sentimentResult = (0, _sentiment2.default)(tweetText);

				var scoreTweet = {
					score: sentimentResult.score,
					tweet: tweetText
				};

				tweets.push(scoreTweet);
			}).on('end', function () {
				_this.sortTweets();
				console.log("AVERAGE: " + _this.averageTweets());
			}));
		}
	}, {
		key: 'sortTweets',
		value: function sortTweets() {
			var sortedtweets = _lodash2.default.sortBy(tweets, 'score');
			console.log(sortedtweets);
		}
	}, {
		key: 'averageTweets',
		value: function averageTweets() {

			var count = tweets.length;

			var scores = (0, _lodash2.default)(tweets).map(function (tweet) {
				return tweet.score;
			});

			var total = (0, _lodash2.default)(scores).reduce();

			var avg = total / count;

			return avg;
		}
	}]);

	return TextAnalyser;
}();

var analyser = new TextAnalyser();

analyser.parseFile('data/data.csv');
analyser.sortTweets();
//# sourceMappingURL=tcom.js.map
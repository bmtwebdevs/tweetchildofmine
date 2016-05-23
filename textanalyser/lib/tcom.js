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
				var tweettext = csvrow[5];
				var sentimentresult = (0, _sentiment2.default)(tweettext);
				var scoretweet = {
					score: sentimentresult.score,
					tweet: tweettext
				};
				tweets.push(scoretweet);
				//do something with csvrow
				//csvData.push(csvrow);      
			}).on('end', function () {
				_this.sortTweets();
			}));
		}
	}, {
		key: 'sortTweets',
		value: function sortTweets() {
			var sortedtweets = _lodash2.default.sortBy(tweets, 'score');
			console.log(sortedtweets);
		}
	}]);

	return TextAnalyser;
}();

var analyser = new TextAnalyser();

analyser.parseFile('data/data.csv');
analyser.sortTweets();

//console.log(r1);        // Score: -2, Comparative: -0.666

// var inputFile='myfile.csv';
//
// var parser = parse({delimiter: ','}, function (err, data) {
//   async.eachSeries(data, function (line, callback) {
//     // do something with the line
//     doSomething(line).then(function() {
//       // when processing finishes invoke the callback to move to the next one
//       callback();
//     });
//   }
// }
//# sourceMappingURL=tcom.js.map
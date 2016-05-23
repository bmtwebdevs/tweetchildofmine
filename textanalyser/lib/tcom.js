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

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextAnalyser = exports.TextAnalyser = function () {
	function TextAnalyser() {
		_classCallCheck(this, TextAnalyser);
	}

	_createClass(TextAnalyser, [{
		key: 'writeLine',
		value: function writeLine(line) {
			console.log(line);
		}
	}, {
		key: 'parseFile',
		value: function parseFile(file) {

			_fs2.default.createReadStream(file).pipe((0, _csvParse2.default)({ delimiter: ',' }).on('data', function (csvrow) {
				console.log(csvrow);
				//do something with csvrow
				//csvData.push(csvrow);      
			}));
		}
	}]);

	return TextAnalyser;
}();

var analyser = new TextAnalyser();

analyser.parseFile('data/data.csv');

//var r1 = sentiment('great awesome winning at life stupid sick fool');
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
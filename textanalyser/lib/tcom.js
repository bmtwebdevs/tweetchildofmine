'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.textAnalyser = undefined;

var _sentiment = require('sentiment');

var _sentiment2 = _interopRequireDefault(_sentiment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//var csv = require('csv-parse');

var textAnalyser = exports.textAnalyser = function textAnalyser() {
	_classCallCheck(this, textAnalyser);
};

var r1 = (0, _sentiment2.default)('great awesome winning at life stupid sick fool');
console.log(r1); // Score: -2, Comparative: -0.666
//# sourceMappingURL=tcom.js.map
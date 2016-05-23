'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _twitterservice = require('../../twitterservice/twitterservice.js');

var _twitterservice2 = _interopRequireDefault(_twitterservice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// routes
_express2.default.get('/', function (req, res) {
			res.sendFile('../web/index.html');
});

_express2.default.get('/get-tweets', function (req, res) {

			var ts = new _twitterservice2.default();

			ts.getTweets();
});

_express2.default.get('/get-db', function (req, res) {});

// create server
var port = process.env.PORT || 5000;

_express2.default.listen(port, function () {
			console.log("Listening on " + port);
});
//# sourceMappingURL=server.js.map
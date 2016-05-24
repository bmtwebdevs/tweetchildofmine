'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _twitterservice = require('../../twitterservice/twitterservice.js');

var _twitterservice2 = _interopRequireDefault(_twitterservice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

// routes
app.get('/', function (req, res) {
			res.sendFile('../web/index.html');
});

app.get('/get-tweets', function (req, res) {

			var ts = new _twitterservice2.default();

			ts.getTweets();
});

app.get('/get-db', function (req, res) {});

// create server
var port = process.env.PORT || 5000;

app.listen(port, function () {
			console.log("Listening on " + port);
});
//# sourceMappingURL=server.js.map
var express = require('express');
var path = require('path');
var http = require('http');
var ts = require( '../twitterservice/twitterservice.js');

var app = express();
app.server = http.createServer(app);

// routes
app.get('/', function(req, res)  {	
	res.sendFile(path.normalize(__dirname + './../web/index.html'));	
});

app.use(express.static(path.normalize(__dirname + './../web/')));

app.get('/get-tweets', function(req, res) {			
	
	ts.getTweets();		
			
});

app.get('/get-db', function (req, res) {	
		
});

// create server
var port = process.env.PORT || 5000;

app.listen(port, function() {
   console.log("Listening on " + port);
});


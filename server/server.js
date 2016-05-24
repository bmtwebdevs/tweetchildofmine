var express = require('express');
var path = require('path');
var http = require('http');
var TwitterService = require( '../twitterservice/twitterservice.js');

var app = express();
app.server = http.createServer(app);

// routes
app.get('/', (req, res) => {	
	res.sendFile(path.normalize(__dirname + './../web/index.html'));	
});

app.use(express.static(path.normalize(__dirname + './../web/')));

app.get('/get-tweets', (req, res) => {	
			
	var ts = new TwitterService();	
	
	ts.getTweets();		
			
});

app.get('/get-db', (req, res) => {	
		
});

// create server
var port = process.env.PORT || 5000;

app.listen(port, () => {
   console.log("Listening on " + port);
});


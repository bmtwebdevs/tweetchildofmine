import express from 'express';
import path from 'path';
import http from 'http';
import ts from '../../twitterservice/twitterservice';
import * as TextAnalyser from '../../textanalyser/textanalyser';

var app = express();
app.server = http.createServer(app);

// routes
app.get('/', (req, res) => {	
	res.sendFile(path.normalize(__dirname + './../../web/index.html'));	
});

app.use(express.static(path.normalize(__dirname + './../../web/')));


app.get('/get-tweets-mock', (req, res) => {
	
	var analyser = new TextAnalyser();		
	
	res.json(analyser.processTweets());
	
});

app.get('/get-tweets', (req, res) => {				
	
	ts.getTweets2((tweets) => {		
		res.json(tweets);	
	});	
	
	
			
});

app.get('/get-db', (req, res) => {	
		
});

// create server
var port = process.env.PORT || 5000;

app.listen(port, () => {
   console.log("Listening on " + port);
});


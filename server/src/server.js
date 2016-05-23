import app from 'express';
import TwitterService from '../../twitterservice/twitterservice.js';

// routes
app.get('/', (req, res) => {	
	res.sendFile('../web/index.html');	
});

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


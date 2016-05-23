import sentiment from 'sentiment'
import parse from 'csv-parse';
import fs from 'fs';
import _ from 'lodash';

var tweets = [];

export class TextAnalyser { 
			
	parseFile(file) {
		
		fs.createReadStream(file)
			.pipe(parse({delimiter: ','})
			.on('data', (csvrow) => {
				
				var tweetText = csvrow[5];
				
        		var sentimentResult = sentiment(tweetText);
				
				var scoreTweet = {
					score: sentimentResult.score,
					tweet: tweetText
				};
				
				tweets.push(scoreTweet);
        		   
    		})	
			.on('end', () => {
				this.sortTweets();
				console.log("AVERAGE: " + this.averageTweets());
			})						
		);				
	}
	
	sortTweets(){
		var sortedtweets = _.sortBy(tweets, 'score');
		console.log(sortedtweets);		
	}
	
	averageTweets() {
		
		var count = tweets.length;
		
		var scores = _(tweets).map((tweet) => {
			return tweet.score
		});
		
		var total = _(scores).reduce();
		
		var avg = total / count;
		
		return avg;
	}
				
}

var analyser = new TextAnalyser();

analyser.parseFile('data/data.csv');
analyser.sortTweets();
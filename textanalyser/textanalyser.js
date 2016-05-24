var sentiment = require("sentiment");
var parse = require("csv-parse");
var fs = require("fs");
var _ = require("lodash");

var TextAnalyser = function () {};
var tweets = [];
TextAnalyser.prototype.parseFile = function(file) { 
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
	
TextAnalyser.prototype.sortTweets = function(){
    var sortedtweets = _.sortBy(tweets, 'score');
    console.log(sortedtweets);		
}
	
TextAnalyser.prototype.averageTweets = function() {
    
    var count = tweets.length;
    
    var scores = _(tweets).map((tweet) => {
        return tweet.score
    });
    
    var total = _(scores).reduce();
    
    var avg = total / count;
    
    return avg;
}
			
module.exports = TextAnalyser;

// var analyser = new TextAnalyser();

// analyser.parseFile('textanalyser/data/data.csv');
// analyser.sortTweets();
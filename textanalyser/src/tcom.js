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
				var tweettext = csvrow[5];
        		var sentimentresult = sentiment(tweettext);
				var scoretweet = {
					score:sentimentresult.score,
					tweet:tweettext
				};
				tweets.push(scoretweet);
        		//do something with csvrow
        		//csvData.push(csvrow);        
    		})	
			.on('end',()=>{
				this.sortTweets();
			})						
		);				
	}
	
	sortTweets(){
		var sortedtweets = _.sortBy(tweets, 'score');
		console.log(sortedtweets);
		
	}
				
}

var analyser = new TextAnalyser();

analyser.parseFile('data/data.csv');
analyser.sortTweets();

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



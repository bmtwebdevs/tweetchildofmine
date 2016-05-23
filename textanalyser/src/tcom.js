import sentiment from 'sentiment'
import parse from 'csv-parse';
import fs from 'fs';
import async from 'async';

export class TextAnalyser {
	
	writeLine(line) {				
		console.log(line)
	}
	
	parseFile(file) {
		
		fs.createReadStream(file)
			.pipe(parse({delimiter: ','})
			.on('data', (csvrow) => {
        		console.log(csvrow);
        		//do something with csvrow
        		//csvData.push(csvrow);        
    		})							
		);				
	}
				
}

var analyser = new TextAnalyser();

analyser.parseFile('data/data.csv');

//var r1 = sentiment('great awesome winning at life stupid sick fool');
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



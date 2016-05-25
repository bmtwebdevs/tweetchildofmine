var oxfordEmotion = require("node-oxford-emotion")("94bbf0c64e9b47c88faa8db3875aeb37")
var _ = require('lodash');

var Recognizerator = function () {};
        
Recognizerator.prototype.analyseMyFaceFromUrl = function(imageUrl, cb) { 
    var result = {};
    oxfordEmotion.recognize("url", imageUrl, function(emotionResults) {
        var emotions = [];
        // get the most occuring emotion in the picture
        if(emotionResults.length > 0) { // can have more than one face in a photo
            for(var i = 0; i < emotionResults.length; i++) {
                var emotion = emotionResults[i];
                var sortable = [];
                for (var score in emotion.scores) {
                    sortable.push([score, emotion.scores[score]])
                }
                sortable.sort(function(a, b) {return b[1] - a[1] }); // sort with highest first
                var highestEmotion = sortable[0][0]; // vom
                // see if the emotion is in the list of emotions
                var foundEmotion = _(emotions).find(function(o) { return o.emotion  === highestEmotion});
                if(foundEmotion) {
                    foundEmotion.count ++;
                } else {
                    emotions.push({emotion: highestEmotion, count: 1});
                }
                
            }
            
            // sort by most occuring emotion first. If there are more than one then sort alphatically by emotion
            emotions.sort(function(a, b) {
                if(a.count< b.count) return 1;
                if(a.count >b.count) return -1;
                if(a.emotion< b.emotion) return -1;
                if(a.emotion >b.emotion) return 1;
                return 0;
            })
            
            result = { statusText: "Success", emotion:  emotions[0].emotion };
        } else {
            result = { statusText: "Success", emotion: "none" }
        }  
        cb(result);
    });
}

module.exports = Recognizerator;
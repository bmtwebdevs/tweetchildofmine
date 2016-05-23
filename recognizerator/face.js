var oxfordEmotion = require("node-oxford-emotion")("94bbf0c64e9b47c88faa8db3875aeb37")
var Recognizerator = function () {};
var _ = require("lodash");

Recognizerator.prototype.analyseMyFaceFromUrl = function(imageUrl, cb) { 
    var emotion = oxfordEmotion.recognize("url", imageUrl, function(emotions) {
        var highestEmotions = [];
        // get the most occuring emotion in the picture
        if(emotions.length > 0) { // can have more than one face in a photo
            for(emotion in emotions) {
                var sortable = [];
                for (var score in emotions[emotion].scores) {
                    sortable.push([score, emotions[emotion].scores[score]])
                }
                sortable.sort(function(a, b) {return b[1] - a[1] })
                var highestEmotion = sortable[0][0];
                var foundEmotion = highestEmotions.find(function(o) { return o.emotion  === highestEmotion});
                if(foundEmotion) {
                     foundEmotion.count ++;
                } else {
                    highestEmotions.push({emotion: highestEmotion, count: 1});
                }
                
            }
            highestEmotions.sort(function(a, b) {
                if(a.count< b.count) return 1;
                if(a.count >b.count) return -1;
                if(a.emotion< b.emotion) return -1;
                if(a.emotion >b.emotion) return 1;
                return 0;
            })
            
            cb({ statusText: "Success", emotion:  highestEmotions[0].emotion});
        } else {
            cb({ statusText: "No Face detected" });
        }
    });
}

module.exports = Recognizerator;
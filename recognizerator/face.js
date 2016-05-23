var oxfordEmotion = require("node-oxford-emotion")("94bbf0c64e9b47c88faa8db3875aeb37")
var Recognizerator = function () {};

Recognizerator.prototype.analyseMyFaceFromUrl = function(imageUrl, cb) { 
    var emotion = oxfordEmotion.recognize("url", imageUrl, function(emotions) {
        if(emotions.length > 0) {
            var sortable = [];
            for (var score in emotions[0].scores) {
                sortable.push([score, emotions[0].scores[score]])
            }
            sortable.sort(function(a, b) {return b[1] - a[1] })
            
            cb({ statusText: "Success", emotion: sortable[0][0] });
        } else {
            cb({ statusText: "No Face detected" });
        }
    });
}

module.exports = Recognizerator;
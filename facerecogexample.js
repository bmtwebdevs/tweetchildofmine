var Face = require('./recognizerator/face.js');
var Twitterservice = require("./twitterservice/twitterservice.js");
var face = new Face();


var service = new Twitterservice();
var ts = service.getTweets();

console.time("analyseface");
face.analyseMyFaceFromUrl("http://blog.meuingles.com/wp-content/uploads/2015/07/Conto-da-Tamara-So-Many-Emotions.png", function(result) {
    console.timeEnd("analyseface");
    console.log(result.statusText, result.emotion);
});

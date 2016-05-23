var Face = require('./recognizerator/face.js');
var face = new Face();
face.analyseMyFaceFromUrl("https://pbs.twimg.com/media/CjGtUX0WUAAur07.jpg:large", function(cb) {
    console.log("hell0");
    console.log(cb.statusText, cb.emotion);
});

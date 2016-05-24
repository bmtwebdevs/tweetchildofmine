var Face = require('./recognizerator/face.js');
var face = new Face();
face.analyseMyFaceFromUrl("http://blog.meuingles.com/wp-content/uploads/2015/07/Conto-da-Tamara-So-Many-Emotions.png", function(cb) {
    console.log(cb);
    console.log(cb.statusText, cb.emotion);
});

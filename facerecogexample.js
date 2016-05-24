var Face = require('./recognizerator/face.js');
var face = new Face();
console.time("analyseface");
face.analyseMyFaceFromUrl("http://blog.meuingles.com/wp-content/uploads/2015/07/Conto-da-Tamara-So-Many-Emotions.png", function(result) {
    console.timeEnd("analyseface");
    console.log(result.statusText, result.emotion);
});

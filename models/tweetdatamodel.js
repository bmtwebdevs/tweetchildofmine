"use strict";
var tweetdatamodel = (function () {
    function tweetdatamodel(id, tweetjson, facedetected, textscore, photoscore) {
        this.id = id,
            this.tweetjson = tweetjson,
            this.facedetected = facedetected,
            this.textscore = textscore,
            this.photoscore = photoscore;
    }
    ;
    return tweetdatamodel;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tweetdatamodel;

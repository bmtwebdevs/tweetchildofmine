"use strict";
var tweetdatamodel = (function () {
    function tweetdatamodel(text, photo, location, when) {
        this.text = text,
            this.photo = photo,
            this.location = location,
            this.when = when;
    }
    ;
    return tweetdatamodel;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tweetdatamodel;

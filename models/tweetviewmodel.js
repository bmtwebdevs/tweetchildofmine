"use strict";
var tweetviewmodel = (function () {
    function tweetviewmodel(text, photo, location, when) {
        this.text = text,
            this.photo = photo,
            this.location = location,
            this.when = when;
    }
    ;
    return tweetviewmodel;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tweetviewmodel;

"use strict";
var geolocation = (function () {
    function geolocation(latitude, longitude, name) {
        this.latitude = latitude,
            this.longitude = longitude,
            this.name = name;
    }
    return geolocation;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = geolocation;

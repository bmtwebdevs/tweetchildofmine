export default class geolocation {
    name: string;
    latitude: number;
    longitude: number;
    constructor(latitude, longitude, name){
        this.latitude = latitude,
        this.longitude = longitude,
        this.name = name
    }
}

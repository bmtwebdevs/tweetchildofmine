export default class tweetdatamodel{
    text: string;
    photo: any;
    location: any;
    when: any;
    textscore: number;
    photoscore: number;
    constructor(text, photo, location, when){
        this.text = text,
        this.photo = photo,
        this.location = location,
        this.when = when
    };
}

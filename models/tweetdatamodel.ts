export default class tweetdatamodel{
    tweetjson: any;
    facedetected: boolean;
    textscore: number;
    photoscore: number;
    constructor(tweetjson, facedetected, textscore, photoscore){
        this.tweetjson = tweetjson,
        this.facedetected = facedetected,
        this.textscore = textscore,
        this.photoscore = photoscore
    };
}

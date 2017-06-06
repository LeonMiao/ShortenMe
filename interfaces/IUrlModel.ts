import Mongoose = require("mongoose");

interface IUrlModel extends Mongoose.Document {
    accountId: string;
    urls: [ {
        urlId: number;
        shortUrl: string;
        longUrl: string;
        emojiLink: string;
        expirationDate: string;
        isRemoved: boolean;
    }];
}
export default IUrlModel;

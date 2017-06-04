import Mongoose = require('mongoose');
import DataAccess from '../DataAccess';
import IUrlModel from '../interfaces/IUrlModel';

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

export default class UrlModel {
    public schema: Mongoose.Schema;
    public model: any;

    public constructor() {
        this.createSchema();
        this.createModel();
    }

    public createSchema(): void {
        this.schema = mongoose.Schema(
            {
                accountId: Number,
                urls: [{
                    urlId: Number,
                    shortUrl: String,
                    longUrl: String,
                    emojiLink: String,
                    expirationDate: String,
                    isRemoved: Boolean
                }]
            }, { collection: 'urls' }
        );
    }

    public createModel(): void {
        this.model = mongooseConnection.model<IUrlModel>("Url", this.schema);
    }

    public retrieveUrlsDetails(response: any, filter: Object) {
        var query = this.model.findOne(filter);
        query.exec((err, itemArray) => {
            response.json(itemArray);
        });
    }

    public retrieveLongUrl(response: any, filter: Object) {
        var query = this.model.findOne(filter);
        query.exec((err, url) => {
            response.json(url);
        });
    }

    public retrieveUrlsCount(response: any, filter: Object) {
        var query = this.model.find(filter).select('urls').count();
        query.exec((err, numberOfUrls) => {
            console.log('number of urls: ' + numberOfUrls);
            response.json(numberOfUrls);
        });
    }

    // public AddUrlsToList(response:any, filter:Object, 
    //                                    urlId_data: Number, 
    //                                    shortUrl_data: String, 
    //                                    longUrl_data: String, 
    //                                    expiration_data: String, 
    //                                    isRemoved_data: Boolean) {

    public AddUrlsToList(response: any, filter: Object, newUrlObj: Object) {
        // var new_url_data = {
        //     urlId: urlId_data,
        //     shortUrl: shortUrl_data,
        //     longUrl: longUrl_data,
        //     expirationDate: expiration_data,
        //     isRemoved: isRemoved_data
        // };

        var query = this.model.findOneAndUpdate(filter, { $push: { urls: newUrlObj } });
        query.exec((err, itemArray) => {
            //var urlArrayLen = itemArray.urls.length;
            //console.log("urlarraylen: "+ urlArrayLen);
            //response.json(itemArray.urls[urlArrayLen-1]);
            //response.json(itemArray);
            response.json(newUrlObj);
        });
    }

}
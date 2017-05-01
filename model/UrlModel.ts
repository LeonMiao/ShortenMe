import Mongoose = require('mongoose');
import DataAccess from '../DataAccess';
import IUrlModel from '../interfaces/IUrlModel';

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

export default class UrlModel {
    public schema:Mongoose.Schema;
    public model:any;

    public constructor() {
        this.createSchema();
        this.createModel();
    }

    public createSchema(): void {
        this.schema =  mongoose.Schema(
            {
                accountId: Number,
                urls: [ {
                    urlId: Number,
                    shortUrl: String,
                    longUrl: String,
                    expirationDate: String,
                    isRemoved: Boolean
                }]
            }, {collection: 'urls'}
        );
    }

    public createModel(): void {
        this.model = mongooseConnection.model<IUrlModel>("Url", this.schema);
    }
    
    public retrieveUrlsDetails(response:any, filter:Object) {
        var query = this.model.findOne(filter);
        query.exec( (err, itemArray) => {
            response.json(itemArray);
        });
    }

    public retrieveUrlsCount(response:any, filter:Object) {
        var query = this.model.find(filter).select('urls').count();
        query.exec( (err, numberOfUrls) => {
            console.log('number of urls: ' + numberOfUrls);
            response.json(numberOfUrls);
        });
    }

}
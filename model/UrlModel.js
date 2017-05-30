"use strict";
exports.__esModule = true;
var DataAccess_1 = require("../DataAccess");
var mongoose = DataAccess_1["default"].mongooseInstance;
var mongooseConnection = DataAccess_1["default"].mongooseConnection;
var UrlModel = (function () {
    function UrlModel() {
        this.createSchema();
        this.createModel();
    }
    UrlModel.prototype.createSchema = function () {
        this.schema = mongoose.Schema({
            accountId: Number,
            urls: [{
                    urlId: Number,
                    shortUrl: String,
                    longUrl: String,
                    expirationDate: String,
                    isRemoved: Boolean
                }]
        }, { collection: 'urls' });
    };
    UrlModel.prototype.createModel = function () {
        this.model = mongooseConnection.model("Url", this.schema);
    };
    UrlModel.prototype.retrieveUrlsDetails = function (response, filter) {
        var query = this.model.findOne(filter);
        query.exec(function (err, itemArray) {
            response.json(itemArray);
        });
    };
    UrlModel.prototype.retrieveUrlsCount = function (response, filter) {
        var query = this.model.find(filter).select('urls').count();
        query.exec(function (err, numberOfUrls) {
            console.log('number of urls: ' + numberOfUrls);
            response.json(numberOfUrls);
        });
    };
    // public AddUrlsToList(response:any, filter:Object, 
    //                                    urlId_data: Number, 
    //                                    shortUrl_data: String, 
    //                                    longUrl_data: String, 
    //                                    expiration_data: String, 
    //                                    isRemoved_data: Boolean) {
    UrlModel.prototype.AddUrlsToList = function (response, filter, newUrlObj) {
        // var new_url_data = {
        //     urlId: urlId_data,
        //     shortUrl: shortUrl_data,
        //     longUrl: longUrl_data,
        //     expirationDate: expiration_data,
        //     isRemoved: isRemoved_data
        // };
        var query = this.model.findOneAndUpdate(filter, { $push: { urls: newUrlObj } });
        query.exec(function (err, itemArray) {
            //var urlArrayLen = itemArray.urls.length;
            //console.log("urlarraylen: "+ urlArrayLen);
            //response.json(itemArray.urls[urlArrayLen-1]);
            //response.json(itemArray);
            response.json(newUrlObj);
        });
    };
    return UrlModel;
}());
exports["default"] = UrlModel;

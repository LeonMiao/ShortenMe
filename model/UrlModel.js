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
    return UrlModel;
}());
exports["default"] = UrlModel;

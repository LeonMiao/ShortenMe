"use strict";
exports.__esModule = true;
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var short_unique_id_1 = require("short-unique-id");
// import ListModel from './model/ListModel';
// import TaskModel from './model/TaskModel';
// models for account and url
var AccountModel_1 = require("./model/AccountModel");
var UrlModel_1 = require("./model/UrlModel");
var uid = new short_unique_id_1();
// Creates and configures an ExpressJS web server.
var App = (function () {
    //public uid: ShortUniqueId;
    //Run configuration methods on the Express instance.
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
        this.idGeneratorAccount = 1;
        this.idGeneratorUrl = 1;
        this.Accounts = new AccountModel_1["default"]();
        this.Urls = new UrlModel_1["default"]();
        //this.uid = new ShortUniqueId();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        // don't forget to add this when using 4200 ng server
        router.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        router.get('/app/account/:accountId/count', function (req, res) {
            var id = req.params.accountId;
            console.log('Query single account with id: ' + id);
            _this.Urls.retrieveUrlsCount(res, { accountId: id });
        });
        router.post('/app/account/', function (req, res) {
            console.log(req.body);
            var jsonObj = req.body;
            jsonObj.accountId = _this.idGeneratorAccount;
            _this.Accounts.model.create([jsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send(_this.idGeneratorAccount.toString());
            _this.idGeneratorAccount++;
        });
        router.get('/app/account/:accountId', function (req, res) {
            var id = req.params.accountId;
            console.log('Query single account with id: ' + id);
            _this.Urls.retrieveUrlsDetails(res, { accountId: id });
        });
        router.get('/app/account/', function (req, res) {
            console.log('Query All account');
            _this.Accounts.retrieveAllAccounts(res);
        });
        router.post('/app/url', function (req, res) {
            var longUrl = req.body.longUrl;
            if (longUrl.indexOf('http') === -1) {
                longUrl = "http://" + longUrl;
            }
            _this.Urls.model.findOne({ accountId: 1 }, { urls: { $elemMatch: { 'longUrl': longUrl } } }, function (err, url) {
                // this.Urls.model.findOne({ longUrl: longUrl }, function (err, url) {
                if (url.urls[0]) {
                    console.log("found longUrl in the model");
                    // will return a url model with one match url item in an array
                    // so we need to in fact return url.urls[0]
                    console.log(url.urls[0]);
                    res.json(url.urls[0]);
                }
                else {
                    console.log("Not found longUrl in the model");
                    var shortUrl = uid.randomUUID(6);
                    console.log(shortUrl);
                    var new_url_data = {
                        urlId: _this.idGeneratorUrl,
                        shortUrl: shortUrl,
                        longUrl: longUrl,
                        expirationDate: "6-18-2017",
                        isRemoved: false
                    };
                    _this.Urls.AddUrlsToList(res, { accountId: 1 }, new_url_data);
                    _this.idGeneratorUrl++;
                }
            });
            //res.json(new_url_data)
        });
        router.get('/app/url/:shortUrl', function (req, res) {
            // use .params in Express
            var shortUrl = req.params.shortUrl;
            _this.Urls.model.findOne({ accountId: 1 }, { urls: { $elemMatch: { 'shortUrl': shortUrl } } }, function (err, url) {
                // this.Urls.model.findOne({ longUrl: longUrl }, function (err, url) {
                if (url.urls[0]) {
                    console.log("found shortUrl in the model");
                    // will return a url model with one match url item in an array
                    // so we need to in fact return url.urls[0]
                    console.log(url.urls[0]);
                    res.json(url.urls[0]);
                }
                else {
                    console.log("not found shortUrl in the model");
                    res.status(404).send('what??? shortUrl not found.');
                }
            });
        });
        // public AddUrlsToList(response:any, filter:Object, 
        //                                urlId_data: Number, 
        //                                shortUrl_data: String, 
        //                                longUrl_data: String, 
        //                                expiration_data: String, 
        //                                isRemoved_data: Boolean) 
        this.express.use('/', router);
        // this.express.use('/app/json/', express.static(__dirname+'/app/json'));
        this.express.use('/image', express.static(__dirname + '/assets/images'));
        this.express.use('/', express.static(__dirname + '/dist'));
    };
    return App;
}());
exports["default"] = new App().express;

"use strict";
exports.__esModule = true;
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
// import ListModel from './model/ListModel';
// import TaskModel from './model/TaskModel';
// models for account and url
var AccountModel_1 = require("./model/AccountModel");
var UrlModel_1 = require("./model/UrlModel");
// Creates and configures an ExpressJS web server.
var App = (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
        this.idGenerator = 100;
        this.Accounts = new AccountModel_1["default"]();
        this.Urls = new UrlModel_1["default"]();
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
            jsonObj.accountId = _this.idGenerator;
            _this.Accounts.model.create([jsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send(_this.idGenerator.toString());
            _this.idGenerator++;
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
            var longUrl = req.body.longUrl; //-> directly use the req body parsed by jsonParser
            // urlService.getShortUrl(longUrl, function (url) {
            //     res.json(url);
            // });
            var new_url_data = {
                urlId: 6,
                shortUrl: "www.shortenme.com/new_url_for_test",
                longUrl: longUrl,
                expirationDate: "5-23-2017",
                isRemoved: false
            };
            _this.Urls.AddUrlsToList(res, { accountId: 1 }, new_url_data);
            //res.json(new_url_data)
        });
        // router.get('/app/url/:shortUrl', (req, res) {
        //     // use .params in Express
        //     var shortUrl = req.params.shortUrl;
        //     urlService.getLongUrl(shortUrl, function (url) {
        //         res.json(url);   
        //     });
        // });
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

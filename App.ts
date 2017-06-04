import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as url from 'url';
import * as bodyParser from 'body-parser';
import ShortUniqueId from 'short-unique-id';

// import ListModel from './model/ListModel';
// import TaskModel from './model/TaskModel';

// models for account and url
import AccountModel from './model/AccountModel';
import UrlModel from './model/UrlModel';

import DataAccess from './DataAccess';

const uid: ShortUniqueId = new ShortUniqueId();

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    public Accounts: AccountModel;
    public Urls: UrlModel;
    public idGeneratorAccount: number;
    public idGeneratorUrl: number;
    //public uid: ShortUniqueId;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.idGeneratorAccount = 1;
        this.idGeneratorUrl = 1;
        this.Accounts = new AccountModel();
        this.Urls = new UrlModel();
        //this.uid = new ShortUniqueId();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // Configure API endpoints.
    private routes(): void {
        let router = express.Router();

        // don't forget to add this when using 4200 ng server
        router.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        router.get('/app/account/:accountId/count', (req, res) => {
            var id = req.params.accountId;
            console.log('Query single account with id: ' + id);
            this.Urls.retrieveUrlsCount(res, { accountId: id });
        });

        router.post('/app/account/', (req, res) => {
            console.log(req.body);
            var jsonObj = req.body;
            jsonObj.accountId = this.idGeneratorAccount;
            this.Accounts.model.create([jsonObj], (err) => {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send(this.idGeneratorAccount.toString());
            this.idGeneratorAccount++;
        });

        router.get('/app/account/:accountId', (req, res) => {
            var id = req.params.accountId;
            console.log('Query single account with id: ' + id);
            this.Urls.retrieveUrlsDetails(res, { accountId: id });
        });

        router.get('/app/account/', (req, res) => {
            console.log('Query All account');
            this.Accounts.retrieveAllAccounts(res);
        });

        router.post('/app/url', (req, res) => {
            var longUrl = req.body.longUrl;

            if (longUrl.indexOf('http') === -1) {
                longUrl = "http://" + longUrl;
            }

            this.Urls.model.findOne({ accountId: 1 }, { urls: { $elemMatch: { 'longUrl': longUrl } } }, function (err, url) {
                // this.Urls.model.findOne({ longUrl: longUrl }, function (err, url) {
                if (url.urls[0]) {
                    console.log("found longUrl in the model");
                    // will return a url model with one match url item in an array
                    // so we need to in fact return url.urls[0]
                    console.log(url.urls[0]);

                    res.json(url.urls[0]);

                } else {
                    console.log("Not found longUrl in the model");

                    var shortUrl = uid.randomUUID(6);
                    console.log(shortUrl);
                    var new_url_data = {
                        urlId: this.idGeneratorUrl,
                        shortUrl: shortUrl,
                        longUrl: longUrl,
                        expirationDate: "6-18-2017",
                        isRemoved: false
                    };
                    this.Urls.AddUrlsToList(res, { accountId: 1 }, new_url_data);
                    this.idGeneratorUrl++;
                }
            });
        });

        router.get('/app/url/:shortUrl', function (req, res) {
            // use .params in Express
            var shortUrl = req.params.shortUrl;

            this.Urls.model.findOne({ accountId: 1 }, { urls: { $elemMatch: { 'shortUrl': shortUrl } } }, function (err, url) {
                // this.Urls.model.findOne({ longUrl: longUrl }, function (err, url) {
                if (url.urls[0]) {
                    console.log("found shortUrl in the model");
                    // will return a url model with one match url item in an array
                    // so we need to in fact return url.urls[0]
                    console.log(url.urls[0]);

                    res.json(url.urls[0]);

                } else {
                    console.log("not found shortUrl in the model");

                    res.status(404).send('what??? shortUrl not found.');
                }
            });
        });


        router.get('*', function (req, res) {
            // originalUrl = "/XXX" instead of "XXX", which is what we need
            var shortUrl = req.originalUrl.slice(1);

            this.Urls.model.findOne({ accountId: 1 }, { urls: { $elemMatch: { 'shortUrl': shortUrl } } }, function (err, url) {
                // this.Urls.model.findOne({ longUrl: longUrl }, function (err, url) {
                if (url.urls[0]) {
                    console.log("shortUrl routing: found shortUrl in the model");
                    // will return a url model with one match url item in an array
                    // so we need to in fact return url.urls[0]
                    console.log(url.urls[0]);
                    //res.json(url.urls[0]);
                    res.redirect(url.urls[0].longUrl);
                    // record the stats
                    //statsService.logRequest(shortUrl, req);

                } else {
                    console.log("shortUrl routing: not found shortUrl in the model");
                    res.status(404).send('what??? shortUrl not found.');
                    //res.sendFile('404.html', { root: path.join(__dirname + '/../public/views') });
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


    }

}

export default new App().express;

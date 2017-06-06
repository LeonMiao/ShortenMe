import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as url from 'url';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';

import ShortUniqueId from 'short-unique-id';
import emoji from 'emojilib';

// models for account and url
import AccountModel from './model/AccountModel';
import UrlModel from './model/UrlModel';

import DataAccess from './DataAccess';
import FacebookPassportObj from './FacebookPassport';

let passport = require('passport');

const uid: ShortUniqueId = new ShortUniqueId();

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    public Accounts: AccountModel;
    public Urls: UrlModel;
    public idGeneratorAccount: number;
    public idGeneratorUrl: number;
    public facebookPassportObj: FacebookPassportObj;

    //Run configuration methods on the Express instance.
    constructor() {
        this.facebookPassportObj = new FacebookPassportObj();
        this.express = express();
        this.middleware();
        this.routes();
        this.idGeneratorAccount = 1;
        this.idGeneratorUrl = 1;
        this.Accounts = new AccountModel();
        this.Urls = new UrlModel();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(session({ secret: 'keyboard cat' }));
        this.express.use(passport.initialize());
        this.express.use(passport.session());
    }

    private validateAuth(req, res, next): void {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/');
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

        router.get('/auth/facebook',
            passport.authenticate('facebook',
                { scope: ['public_profile', 'email'] }
            )
        );

        router.get('/auth/facebook/callback',
            passport.authenticate('facebook',
                { failureRedirect: '/', successRedirect: '/url' }
            )
        );

        router.get('/auth/userdata', this.validateAuth, (req, res) => {
            console.log('user object:' + JSON.stringify(req.user));
            res.json(req.user);
        });

        // not really used
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

                    var emojiUrlLength = 8;

                    var emojiTxtList = emoji.ordered;
                    var emojiLib = emoji.lib;
                    var emojiLink = '';

                    var emojiSelected = '';

                    for (var i = 0; i < emojiUrlLength; ++i) {
                        var emojiIndexSelected = Math.ceil(Math.random() * emojiTxtList.length);
                        if (emojiLib[emojiTxtList[emojiIndexSelected]].char) {
                            emojiSelected = emojiLib[emojiTxtList[emojiIndexSelected]].char;
                        }
                        emojiLink += emojiSelected;
                        emojiSelected = '';
                    }

                    console.log("emojiLink: " + emojiLink);

                    var new_url_data = {
                        urlId: this.idGeneratorUrl,
                        shortUrl: shortUrl,
                        longUrl: longUrl,
                        emojiLink: emojiLink,
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


        router.get('/redirect/:redirectUrl', function (req, res) {
            // originalUrl = "/XXX" instead of "XXX", which is what we need
            //var redirectUrl = req.originalUrl.slice(1);

            var redirectUrl = req.params.redirectUrl;

            // prevent the emojiLink from encoding
            redirectUrl = decodeURI(redirectUrl);

            // if (redirectUrl.length == 0){
            //     return;
            // }

            if (redirectUrl.length == 6) {
                this.Urls.model.findOne({ accountId: 1 }, { urls: { $elemMatch: { 'shortUrl': redirectUrl } } }, function (err, url) {
                    // this.Urls.model.findOne({ longUrl: longUrl }, function (err, url) {
                    if (url.urls[0]) {
                        console.log("shortUrl routing: found shortUrl in the model");
                        // will return a url model with one match url item in an array
                        // so we need to in fact return url.urls[0]
                        console.log(url.urls[0]);
                        res.redirect(url.urls[0].longUrl);

                    } else {
                        console.log("shortUrl routing: not found shortUrl in the model");
                        res.status(404).send('what??? shortUrl not found.');
                        //res.sendFile('404.html', { root: path.join(__dirname + '/../public/views') });
                    }
                });
            } else {
                this.Urls.model.findOne({ accountId: 1 }, { urls: { $elemMatch: { 'emojiLink': redirectUrl } } }, function (err, url) {
                    // this.Urls.model.findOne({ longUrl: longUrl }, function (err, url) {
                    if (url.urls[0]) {
                        console.log("emojiLink routing: found emojiLink in the model");
                        // will return a url model with one match url item in an array
                        // so we need to in fact return url.urls[0]
                        console.log(url.urls[0]);
                        res.redirect(url.urls[0].longUrl);

                    } else {
                        console.log("emojiLink routing: not found emojiLink in the model");
                        res.status(404).send('what??? emojiLink not found.');
                        //res.sendFile('404.html', { root: path.join(__dirname + '/../public/views') });
                    }
                });
            }
        });

        // public AddUrlsToList(response:any, filter:Object, 
        //                                urlId_data: Number, 
        //                                shortUrl_data: String, 
        //                                longUrl_data: String, 
        //                                expiration_data: String, 
        //                                isRemoved_data: Boolean) 


        // this.express.use('/app/json/', express.static(__dirname+'/app/json'));

        router.get('*', (req, res) => {
            res.sendFile(__dirname + '/dist/index.html');
        });

        this.express.use('/image', express.static(__dirname + '/assets/images'));
        this.express.use('/', express.static(__dirname + '/dist'));
        this.express.use('/', router);

    }
}

export default new App().express;

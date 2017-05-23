import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as url from 'url';
import * as bodyParser from 'body-parser';

// import ListModel from './model/ListModel';
// import TaskModel from './model/TaskModel';

// models for account and url
import AccountModel from './model/AccountModel';
import UrlModel from './model/UrlModel';

import DataAccess from './DataAccess';

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    public Accounts: AccountModel;
    public Urls: UrlModel;
    public idGenerator: number;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.idGenerator = 100;
        this.Accounts = new AccountModel();
        this.Urls = new UrlModel();
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
            jsonObj.accountId = this.idGenerator;
            this.Accounts.model.create([jsonObj], (err) => {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send(this.idGenerator.toString());
            this.idGenerator++;
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

        this.express.use('/', router);

        // this.express.use('/app/json/', express.static(__dirname+'/app/json'));
        this.express.use('/image', express.static(__dirname + '/assets/images'));
        this.express.use('/', express.static(__dirname + '/pages'));

    }

}

export default new App().express;

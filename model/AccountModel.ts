import Mongoose = require('mongoose');
import DataAccess from '../DataAccess';
import IAccountModel from '../interfaces/IAccountModel';

var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

export default class AccountModel {
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
                userName: String,
                userType: String,
                createDate: String
            }, {collection: 'accounts'}
        );
    }

    public createModel(): void {
        this.model = mongooseConnection.model<IAccountModel>("Accounts", this.schema);
    }

    public retrieveAllAccounts(response:any): any {
        var query = this.model.find({});
        query.exec( (err, itemArray) => {
            response.json(itemArray) ;
        });
    }
}
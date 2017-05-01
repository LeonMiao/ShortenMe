"use strict";
exports.__esModule = true;
var DataAccess_1 = require("../DataAccess");
var mongoose = DataAccess_1["default"].mongooseInstance;
var mongooseConnection = DataAccess_1["default"].mongooseConnection;
var AccountModel = (function () {
    function AccountModel() {
        this.createSchema();
        this.createModel();
    }
    AccountModel.prototype.createSchema = function () {
        this.schema = mongoose.Schema({
            accountId: Number,
            userName: String,
            fName: String,
            mName: String,
            lName: String,
            emailAddr: String,
            phoneNum: String,
            userType: String,
            createDate: String
        }, { collection: 'accounts' });
    };
    AccountModel.prototype.createModel = function () {
        this.model = mongooseConnection.model("Accounts", this.schema);
    };
    AccountModel.prototype.retrieveAllAccounts = function (response) {
        var query = this.model.find({});
        query.exec(function (err, itemArray) {
            response.json(itemArray);
        });
    };
    return AccountModel;
}());
exports["default"] = AccountModel;

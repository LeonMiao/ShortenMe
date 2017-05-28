"use strict";
exports.__esModule = true;
var Mongoose = require("mongoose");
var DataAccess = (function () {
    function DataAccess() {
        DataAccess.connect();
    }
    DataAccess.connect = function () {
        if (this.mongooseInstance)
            return this.mongooseInstance;
        this.mongooseConnection = Mongoose.connection;
        this.mongooseConnection.on("open", function () {
            console.log("Connected to mongodb.");
        });
        this.mongooseInstance = Mongoose.connect(this.DB_CONNECTION_STRING);
        return this.mongooseInstance;
    };
    return DataAccess;
}());
DataAccess.DB_CONNECTION_STRING = 'mongodb://shortenme_admin:su5240@ds064799.mlab.com:64799/shortenme_db';
DataAccess.connect();
exports["default"] = DataAccess;

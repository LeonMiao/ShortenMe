import Mongoose = require("mongoose");

interface IAccountModel extends Mongoose.Document {
    accountId: number;
    userName: string;
    userType: string;
    createDate: string;
}
export default IAccountModel;
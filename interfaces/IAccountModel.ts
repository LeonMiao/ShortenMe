import Mongoose = require("mongoose");

interface IAccountModel extends Mongoose.Document {
    accountId: string;
    userName: string;
    fName: string;
    mName: string;
    lName: string;
    emailAddr: string;
    phoneNum: string;
    userType: string;
    createDate: string;
}
export default IAccountModel;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var AccountScope;
(function (AccountScope) {
    AccountScope[AccountScope["ADMIN"] = 2] = "ADMIN";
    AccountScope[AccountScope["HIRER"] = 4] = "HIRER";
    AccountScope[AccountScope["WORKER"] = 8] = "WORKER";
})(AccountScope = exports.AccountScope || (exports.AccountScope = {}));
exports.adminScope = AccountScope.ADMIN;
exports.fullUserScope = AccountScope.HIRER | AccountScope.WORKER;
exports.workerUserScope = AccountScope.WORKER;
const Schema = mongoose.Schema;
const AccountTypeSchema = new Schema({
    label: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    scope: {
        type: Number,
        required: true,
        index: true,
        unique: true
    }
});
const AccountType = mongoose.model("AccountType", AccountTypeSchema);
exports.default = AccountType;

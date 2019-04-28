"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AccountDataSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatarURL: {
        type: String,
        required: true
    },
    accountTypeId: {
        type: mongoose.Types.ObjectId,
        ref: "AccountType"
    }
});
const AccountData = mongoose.model("AccountData", AccountDataSchema);
exports.default = AccountData;

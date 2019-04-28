"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserDataSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
        required: true
    },
    thirdName: {
        type: String
    },
    dob: {
        type: Date,
        required: true
    }
});
const UserData = mongoose.model("UserData", UserDataSchema);
exports.default = UserData;

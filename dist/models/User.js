"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    userDataId: {
        type: Schema.Types.ObjectId,
        ref: "UserData",
        required: true,
        // index: true,
        unique: true
    },
    userProfileId: {
        type: Schema.Types.ObjectId,
        ref: "UserProfile",
        required: true,
        // index: true,
        unique: true
    },
    accountDataId: {
        type: Schema.Types.ObjectId,
        ref: "AccountData",
        required: true,
        // index: true,
        unique: true
    },
    jobTagIds: { type: [Schema.Types.ObjectId], ref: "JobTag", default: [] },
    jobRequestIds: { type: [Schema.Types.ObjectId], ref: "Job", default: [] }
});
const User = mongoose.model("User", UserSchema);
exports.default = User;

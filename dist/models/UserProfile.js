"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserProfileSchema = new Schema({
    dor: {
        type: Date,
        required: true
    },
    rating: {
        type: [Number],
        default: []
    },
    completedJobIds: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});
const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
exports.default = UserProfile;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JobTagSchema = new Schema({
    label: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        default: "#ccff00"
    }
});
const JobTag = mongoose.model("JobTag", JobTagSchema);
exports.default = JobTag;

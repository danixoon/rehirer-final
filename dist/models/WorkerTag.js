"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WorkTagSchema = new Schema({
    label: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        default: "#ffaaff"
    }
});
const WorkTag = mongoose.model("WorkTag", WorkTagSchema);
exports.default = WorkTag;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var JobStatus;
(function (JobStatus) {
    JobStatus[JobStatus["TAKED"] = 0] = "TAKED";
    JobStatus[JobStatus["WAITING"] = 1] = "WAITING";
    JobStatus[JobStatus["COMPLETED"] = 2] = "COMPLETED";
})(JobStatus = exports.JobStatus || (exports.JobStatus = {}));
const Schema = mongoose.Schema;
const JobSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tagIds: { type: [Schema.Types.ObjectId], ref: "JobTag", default: [] },
    status: {
        type: Number,
        default: JobStatus.WAITING
    },
    workerUserId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
const Job = mongoose.model("Job", JobSchema);
exports.default = Job;

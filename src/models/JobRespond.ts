import * as mongoose from "mongoose";

export type JobStatus = "PENDING" | "COMPLETED";

export interface IJobRespond {
  [key: string]: any;
}

export interface IJobRespondModel extends mongoose.Document, IJobRespond {}

export type JobRespondStatus = "PENDING" | "APPROVED" | "DECLINED";

const Schema = mongoose.Schema;
const JobRespondSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: Schema.Types.String,
    required: true
  },
  status: {
    type: Schema.Types.String,
    default: "PENDING"
  }
});

const JobRespond: mongoose.Model<IJobRespondModel> = mongoose.model<IJobRespondModel>("JobRespond", JobRespondSchema);
export default JobRespond;

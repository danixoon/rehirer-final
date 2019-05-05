import * as mongoose from "mongoose";

export type JobStatus = "PENDING" | "COMPLETED";

export interface IJob {
  label: string;
  description: string;
  tags: string[];
  status: JobStatus;
  workerUserId?: mongoose.Schema.Types.ObjectId;
}

export interface IJobModel extends mongoose.Document, IJob {}

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
  city: {
    type: String,
    required: true
  },
  secretInfo: {
    type: String
  },
  tags: { type: [Schema.Types.String], default: [] },
  status: {
    type: Number,
    default: "PENDING"
  },
  rating: {
    type: Number,
  },
  workerUserId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const Job: mongoose.Model<IJobModel> = mongoose.model<IJobModel>("Job", JobSchema);
export default Job;

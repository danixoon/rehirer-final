import * as mongoose from "mongoose";

export type JobStatus = "PENDING" | "COMPLETED";

export interface IJob {
  label: string;
  description: string;
  timespan: number;
  secretInfo?: string;
  city: string;
  tags?: string[];
  status?: JobStatus;
  authorId: mongoose.Schema.Types.ObjectId;
  workerUserId?: mongoose.Schema.Types.ObjectId;
  price: number;
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
  timespan: {
    type: Number,
    required: true
  },
  secretInfo: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  tags: { type: [Schema.Types.String], default: [] },
  status: {
    type: String,
    default: "PENDING"
  },
  rating: {
    type: Number
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  workerUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
});

const Job: mongoose.Model<IJobModel> = mongoose.model<IJobModel>("Job", JobSchema);
export default Job;

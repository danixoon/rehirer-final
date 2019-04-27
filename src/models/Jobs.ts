import * as mongoose from "mongoose";

export enum JobStatus {
  TAKED,
  WAITING,
  COMPLETED
}

export interface IJob {
  label: string;
  description: string;
  tagIds?: mongoose.Schema.Types.ObjectId[];
  status?: JobStatus;
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

const Job: mongoose.Model<IJobModel> = mongoose.model<IJobModel>("Job", JobSchema);
export default Job;

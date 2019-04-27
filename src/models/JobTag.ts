import * as mongoose from "mongoose";

export interface IJobTag {
  label: string;
  color?: string;
}

export interface IJobTagModel extends mongoose.Document, IJobTag {}

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

const JobTag: mongoose.Model<IJobTagModel> = mongoose.model<IJobTagModel>("JobTag", JobTagSchema);
export default JobTag;

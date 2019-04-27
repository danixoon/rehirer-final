import * as mongoose from "mongoose";

export interface IWorkTag {
  label: string;
  color?: string;
}

export interface IWorkTagModel extends mongoose.Document, IWorkTag {}

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

const WorkTag: mongoose.Model<IWorkTagModel> = mongoose.model<IWorkTagModel>("WorkTag", WorkTagSchema);
export default WorkTag;

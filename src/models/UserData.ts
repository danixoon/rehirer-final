import * as mongoose from "mongoose";

export interface IUserData {
  firstName: string;
  secondName: string;
  thirdName: string;
  socialUrl: string;
  city: string;
  dob: Date;
  tags?: string[];
  userId: mongoose.Schema.Types.ObjectId;
  description: string;
}

export interface IUserDataModel extends mongoose.Document, IUserData {}

const Schema = mongoose.Schema;
const UserDataSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  secondName: {
    type: String,
    required: true
  },
  thirdName: {
    type: String
  },
  socialUrl: {
    type: String
  },
  dob: {
    type: Date,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  tags: {
    type: [Schema.Types.String],
    default: []
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  description: {
    type: Schema.Types.String,
    required: true
  }
});

const UserData: mongoose.Model<IUserDataModel> = mongoose.model<IUserDataModel>("UserData", UserDataSchema);
export default UserData;

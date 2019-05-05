import * as mongoose from "mongoose";

export interface IUserData {
  firstName: String;
  secondName: String;
  thirdName: String;
  socialURL: String;
  city: String;
  dob: Date;
  userId: mongoose.Schema.Types.ObjectId;
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
  socialURL: {
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
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  }
});

const UserData: mongoose.Model<IUserDataModel> = mongoose.model<IUserDataModel>("UserData", UserDataSchema);
export default UserData;

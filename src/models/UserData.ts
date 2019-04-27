import * as mongoose from "mongoose";

export interface IUserData {
  firstName: String;
  secondName: String;
  thirdName: String;
  dob: Date;
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
  dob: {
    type: Date,
    required: true
  }
});

const UserData: mongoose.Model<IUserDataModel> = mongoose.model<IUserDataModel>("UserData", UserDataSchema);
export default UserData;

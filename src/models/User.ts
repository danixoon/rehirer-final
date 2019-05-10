import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IUser {
  verifed: boolean;
  // userId: number;
  // accountDataId: mongoose.Types.ObjectId;
  // userDataId: mongoose.Types.ObjectId;
  // userProfileId: mongoose.Types.ObjectId;
  // jobTagIds?: mongoose.Schema.Types.ObjectId[];
  // jobRequestsIds?: mongoose.Schema.Types.ObjectId[];
  // tags: [];
}

export interface IUserModel extends mongoose.Document, IUser {}

const UserSchema = new Schema({
  verifed: {
    type: Schema.Types.Boolean,
    default: false
  }
  // userDataId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "UserData",
  //   required: true,
  //   // index: true,
  //   unique: true
  // },
  // userProfileId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "UserProfile",
  //   required: true,
  //   // index: true,
  //   unique: true
  // },
  // accountDataId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "AccountData",
  //   required: true,
  //   // index: true,
  //   unique: true
  // },
  // jobTagIds: { type: [Schema.Types.ObjectId], ref: "JobTag", default: [] },
  // jobRequestIds: { type: [Schema.Types.ObjectId], ref: "Job", default: [] }
});

const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);
export default User;

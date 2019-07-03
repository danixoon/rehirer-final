import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IUser {
  verifed: boolean;
}

export interface IUserModel extends mongoose.Document, IUser {}

const UserSchema = new Schema({
  verifed: {
    type: Schema.Types.Boolean,
    default: false
  }
});

const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);
export default User;

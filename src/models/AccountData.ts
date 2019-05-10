import * as mongoose from "mongoose";

export interface IAccountData {
  username: string;
  email: string;
  password: string;
  userId: mongoose.Schema.Types.ObjectId;
  accountScope?: AccountScope;
}

export type AccountScope = "ADMIN" | "USER";

export interface IAccountDataModel extends mongoose.Document, IAccountData {}

const Schema = mongoose.Schema;
const AccountDataSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accountScope: {
    type: String,
    default: "USER"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  }
});

const AccountData: mongoose.Model<IAccountDataModel> = mongoose.model<IAccountDataModel>("AccountData", AccountDataSchema);
export default AccountData;

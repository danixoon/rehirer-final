import * as mongoose from "mongoose";

export enum AccountScope {
  ADMIN = 1 << 1,
  HIRER = 1 << 2,
  WORKER = 1 << 3
}

export const adminScope: AccountScope = AccountScope.ADMIN;
export const fullUserScope: AccountScope = AccountScope.HIRER | AccountScope.WORKER;
export const workerUserScope: AccountScope = AccountScope.WORKER;

export interface IAccountType {
  label: string;
  scope: AccountScope;
}

export interface IAccountTypeModel extends mongoose.Document, IAccountType {}

const Schema = mongoose.Schema;
const AccountTypeSchema = new Schema({
  label: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  scope: {
    type: Number,
    required: true,
    index: true,
    unique: true
  }
});

const AccountType: mongoose.Model<IAccountTypeModel> = mongoose.model<IAccountTypeModel>("AccountType", AccountTypeSchema);
export default AccountType;

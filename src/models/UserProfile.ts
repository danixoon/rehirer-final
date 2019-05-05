import * as mongoose from "mongoose";

export interface IUserProfile {
  dor: Date;
  completedJobIds?: mongoose.Schema.Types.ObjectId[];
  userId: mongoose.Schema.Types.ObjectId;
}

export interface IUserProfileModel extends mongoose.Document, IUserProfile {}

const Schema = mongoose.Schema;
const UserProfileSchema = new Schema({
  dor: {
    type: Date,
    required: true
  },
  completedJobIds: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  }
});

const UserProfile: mongoose.Model<IUserProfileModel> = mongoose.model<IUserProfileModel>("UserProfile", UserProfileSchema);
export default UserProfile;

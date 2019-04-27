import * as mongoose from "mongoose";

export interface IUserProfile {
  dor: Date;
  rating?: number[];
  completedJobIds?: mongoose.Schema.Types.ObjectId[];
}

export interface IUserProfileModel extends mongoose.Document, IUserProfile {}

const Schema = mongoose.Schema;
const UserProfileSchema = new Schema({
  dor: {
    type: Date,
    required: true
  },
  rating: {
    type: [Number],
    default: []
  },
  completedJobIds: {
    type: [Schema.Types.ObjectId],
    default: []
  }
});

const UserProfile: mongoose.Model<IUserProfileModel> = mongoose.model<IUserProfileModel>("UserProfile", UserProfileSchema);
export default UserProfile;

import * as mongoose from "mongoose";

export interface IImage {}

export type AccountScope = "ADMIN" | "USER";

export interface IImageModel extends mongoose.Document, IImage {}

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  }
});

const Image: mongoose.Model<IImageModel> = mongoose.model<IImageModel>("Image", ImageSchema);
export default Image;

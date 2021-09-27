import * as mongoose from "mongoose";
import { Types } from "mongoose";
const schema = mongoose.Schema;

export default mongoose.model(
  "Channel",
  new schema({
    _id: { type: Types.ObjectId },
    label: { type: String, default: "" },
    urlChannel: { type: String },
    id: { type: String },
    subscribe: { type: String, default: "" },
    views: { type: String, default: "" },
    title: { type: String },
    numberVideos: { type: String, default: "" },
    date: { type: String, default: "" },
    videoList: [
      {
        thumbnail: { type: String },
        id: { type: String },
        title: { type: String },
        publicAt: { type: String },
        days: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        views: { type: String, default: "" },
        date: { type: String, default: "" },
      },
    ],
  })
);

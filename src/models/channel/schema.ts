import * as mongoose from "mongoose";
import { Types } from "mongoose";
const schema = mongoose.Schema;

export default mongoose.model(
  "Channel",
  new schema({
    _id: { type: Types.ObjectId },
    lable: { type: String },
    urlChannel: { type: String },
    id: { type: String },
    subscribe: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    title: { type: String },
    numberVideos: { type: Number, default: 0 },
    oldViews: { type: Number, default: 0 },
    oldSubscribe: { type: Number, default: 0 },
    oldNumberVideos: { type: Number, default: 0 },
    videoList: [
      {
        thumbnail: { type: String },
        id: { type: String },
        title: { type: String },
        publicAt: { type: String },
        days: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        olldViews: { type: Number, default: 0 },
      },
    ],
  })
);

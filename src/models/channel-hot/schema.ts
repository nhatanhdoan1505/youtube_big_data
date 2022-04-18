import * as mongoose from "mongoose";
import { Types } from "mongoose";
const schema = mongoose.Schema;

export default mongoose.model(
  "HotChannel",
  new schema({
    _id: { type: Types.ObjectId },
    label: { type: String },
    urlChannel: { type: String },
    id: { type: String },
    subscribe: { type: Number },
    views: { type: Number },
    title: { type: String },
    numberVideos: { type: Number },
    date: { type: String },
    channelThumbnail: { type: String },
    bannerExternalUrl: { type: String },
    gapSubscribes: { type: Number },
    gapViews: { type: Number },
    gapNumberVideos: { type: Number },
    viewsHistory: { type: String },
    subscribesHistory: { type: String },
    numberVideosHistory: { type: String },
    publishedAt: { type: Date, default: null },
    description: { type: String, default: "" },
    tags: { type: String, default: "" },
  })
);

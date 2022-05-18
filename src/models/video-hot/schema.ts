import * as mongoose from "mongoose";
import { Types } from "mongoose";
const schema = mongoose.Schema;

export default mongoose.model(
  "Hotvideo",
  new schema({
    _id: { type: Types.ObjectId },
    thumbnail: { type: String },
    id: { type: String },
    title: { type: String },
    publicAt: { type: Date, default: null },
    days: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    date: { type: String, default: "" },
    gapViews: { type: Number, default: 0 },
    gapLikes: { type: Number, default: 0 },
    gapDislikes: { type: Number, default: 0 },
    gapCommentsCount: { type: Number, default: 0 },
    description: { type: String, default: "" },
    viewsHistory: { type: String, default: "" },
    dislikesHistory: { type: String, default: "" },
    likesHistory: { type: String, default: "" },
    commentCountHistory: { type: String, default: 0 },
    tags: [{ type: String, default: null }],
    duration: { type: Number, default: 0 },
    madeForKids: { type: Boolean, default: false },
    keywords: [{ type: String, default: null }],
    channelInformation: {
      label: { type: String, default: "" },
      urlChannel: { type: String },
      id: { type: String },
      subscribe: { type: String, default: "" },
      views: { type: String, default: "" },
      title: { type: String },
      numberVideos: { type: String, default: "" },
      date: { type: String, default: "" },
      channelThumbnail: { type: String },
      bannerExternalUrl: { type: String },
      publishedAt: { type: Date, default: null },
      description: { type: String, default: "" },
      tags: { type: String, default: "" },
    },
  })
);

import * as mongoose from "mongoose";
import { Types } from "mongoose";
const schema = mongoose.Schema;

export default mongoose.model(
  "Channel",
  new schema(
    {
      _id: { type: Types.ObjectId },
      label: { type: String, default: "" },
      urlChannel: { type: String },
      id: { type: String },
      subscribe: [{ type: String, default: null }],
      views: { type: String, default: "" },
      title: { type: String },
      numberVideos: { type: String, default: "" },
      date: { type: String, default: "" },
      channelThumbnail: { type: String, default: "" },
      bannerExternalUrl: { type: String, default: "" },
      publishedAt: { type: Date, default: null },
      description: { type: String, default: "" },
      tags: { type: String, default: "" },
      videoList: [
        {
          thumbnail: { type: String },
          id: { type: String },
          title: { type: String },
          publicAt: { type: String },
          days: { type: String, default: "" },
          likes: { type: String, default: "" },
          dislikes: { type: String, default: "" },
          views: { type: String, default: "" },
          commentCount: { type: String, default: "" },
          date: { type: String, default: "" },
          description: { type: String, default: "" },
          tags: [{ type: String, default: null }],
          madeForKids: { type: Boolean, default: false },
          duration: { type: String, default: "" },
        },
      ],
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  )
);

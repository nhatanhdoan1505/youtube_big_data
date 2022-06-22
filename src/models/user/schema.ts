import * as mongoose from "mongoose";
import { Types } from "mongoose";
const schema = mongoose.Schema;

export default mongoose.model(
  "User",
  new schema({
    _id: { type: Types.ObjectId },
    email: { type: String },
    name: { type: String },
    isAdmin: { type: Boolean, default: false },
    photoUrl: { type: String },
    channel: { type: Object, default: null },
    competitorChannel: [{ type: Object }],
    uid: { type: String },
    payment: [{ type: Object, default: null }],
  })
);

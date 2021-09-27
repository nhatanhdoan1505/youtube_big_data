import * as mongoose from "mongoose";
import { Types } from "mongoose";
const schema = mongoose.Schema;

export default mongoose.model(
  "User",
  new schema({
    _id: { type: Types.ObjectId },
    email: { type: String },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verifiedCode: { type: String },
  })
);

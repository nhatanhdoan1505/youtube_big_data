import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  isAdmin: boolean;
  isVerified: boolean;
  verifiedCode: string;
}

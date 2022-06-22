import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  isPremium: boolean;
  photoUrl: string;
  channel: string;
  competitorChannel: string[];
  uid: string;
  payment?: IPayment[];
}

export interface IPayment {
  date: Date;
  title: "MONTHLY" | "YEARLY";
  method: string;
  price: number;
}

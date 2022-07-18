import User from "./schema";
import { Types } from "mongoose";
import { IUser } from "./type";

export class UserService {
  async createUser(params: any) {
    const _session = new User({
      ...params,
      _id: new Types.ObjectId(),
    });
    return _session.save();
  }

  async filterUser(query): Promise<IUser[]> {
    return User.find(query).lean();
  }

  async findUser(query): Promise<IUser> {
    return User.findOne(query).lean();
  }

  async updateUser(query, params): Promise<IUser> {
    return User.findOneAndUpdate(query, params, { new: true }).lean();
  }

  async queryUser(query: any, options?: any): Promise<any> {
    return User.aggregate(query, options);
  }

  async deleteUser(query) {
    return User.deleteMany(query);
  }
}

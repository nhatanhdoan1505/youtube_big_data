import User from "./schema";
import { Types } from "mongoose";
import { IUser } from "./type";

export class UserService {
  async createUser(params: any) {
    const _session = new User({
      ...params,
      _id: new Types.ObjectId(),
    });
    return await _session.save();
  }

  async filterUser(query): Promise<IUser[]> {
    return await User.find(query).lean();
  }

  async findUser(query): Promise<IUser> {
    return await User.findOne(query).lean();
  }

  async updateUser(query, params): Promise<IUser> {
    return await User.findOneAndUpdate(query, params, { new: true }).lean();
  }

  async deleteUser(query) {
    return await User.deleteMany(query);
  }
}

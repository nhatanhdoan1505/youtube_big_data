import { IChannel } from "./type";
import { Types } from "mongoose";
import Channel from "./schema";

export class ChannelService {
  async createChannel(params: any) {
    const _session = new Channel({
      ...params,
      _id: new Types.ObjectId(),
    });
    return await _session.save();
  }

  async filterChannel(query) {
    return await Channel.find(query);
  }

  async findChannel(query) {
    return await Channel.findOne(query);
  }

  async updateChannel(query, params) {
    return await Channel.findOneAndUpdate(query, params, { new: true });
  }

  async deleteChannel(query) {
    return await Channel.deleteMany(query);
  }
}

import { IHotChannel } from "./type";
import { Types } from "mongoose";
import HotChannel from "./schema";

export class HotChannelService {
  async createHotChannel(params: any) {
    const _session = new HotChannel({
      ...params,
      _id: new Types.ObjectId(),
    });
    return await _session.save();
  }

  async filterHotChannel(query): Promise<IHotChannel[]> {
    return await HotChannel.find(query).lean();
  }

  async findHotChannel(query): Promise<IHotChannel> {
    return await HotChannel.findOne(query).lean();
  }

  async updateHotChannel(query, params): Promise<IHotChannel> {
    let { _id, ...updateHotChannel } = params;
    return await HotChannel.findOneAndUpdate(query, updateHotChannel, {
      new: true,
      upsert: true,
    }).lean();
  }

  async queryHotChannel(query: any): Promise<any> {
    return await HotChannel.aggregate(query);
  }

  async getTotalHotChannel(): Promise<number> {
    return await HotChannel.count({}).lean();
  }

  async deleteHotChannel(query) {
    return await HotChannel.deleteMany(query);
  }
}

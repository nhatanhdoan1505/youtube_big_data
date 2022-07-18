import { IHotChannel } from "./type";
import { Types } from "mongoose";
import HotChannel from "./schema";

export class HotChannelService {
  async createHotChannel(params: any) {
    const _session = new HotChannel({
      ...params,
      _id: new Types.ObjectId(),
    });
    return _session.save();
  }

  async filterHotChannel(query): Promise<IHotChannel[]> {
    return HotChannel.find(query).lean();
  }

  async findHotChannel(query): Promise<IHotChannel> {
    return HotChannel.findOne(query).lean();
  }

  async updateHotChannel(query, params): Promise<IHotChannel> {
    let { _id, ...updateHotChannel } = params;
    return HotChannel.findOneAndUpdate(query, updateHotChannel, {
      new: true,
      upsert: true,
    }).lean();
  }

  async queryHotChannel(query: any, condition?: any): Promise<any> {
    return HotChannel.aggregate(query, condition);
  }

  async getTotalHotChannel(): Promise<number> {
    return HotChannel.count({}).lean();
  }

  async deleteHotChannel(query) {
    return HotChannel.deleteMany(query);
  }
}

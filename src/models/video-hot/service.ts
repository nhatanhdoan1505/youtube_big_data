import { IHotVideo } from "./type";
import { Types } from "mongoose";
import HotVideo from "./schema";

export class HotVideoService {
  async createHotVideo(params: any) {
    const _session = new HotVideo({
      ...params,
      _id: new Types.ObjectId(),
    });
    return await _session.save();
  }

  async filterHotVideo(query): Promise<IHotVideo[]> {
    return await HotVideo.find(query).lean();
  }

  async findHotVideo(query): Promise<IHotVideo> {
    return await HotVideo.findOne(query).lean();
  }

  async updateHotVideo(query, params): Promise<IHotVideo> {
    let { _id, ...updateHotVideo } = params;
    return await HotVideo.findOneAndUpdate(query, updateHotVideo, {
      new: true,
      upsert: true,
    }).lean();
  }

  async queryHotVideo(query: any): Promise<any> {
    return await HotVideo.aggregate(query);
  }

  async getTotalHotVideo(): Promise<number> {
    return await HotVideo.count({}).lean();
  }

  async deleteHotVideo(query) {
    return await HotVideo.deleteMany(query);
  }
}

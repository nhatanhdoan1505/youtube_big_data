import { IHotVideo } from "./type";
import { Types } from "mongoose";
import HotVideo from "./schema";

export class HotVideoService {
  async createHotVideo(params: any) {
    const _session = new HotVideo({
      ...params,
      _id: new Types.ObjectId(),
    });
    return _session.save();
  }

  async filterHotVideo(query): Promise<IHotVideo[]> {
    return HotVideo.find(query).lean();
  }

  async findHotVideo(query): Promise<IHotVideo> {
    return HotVideo.findOne(query).lean();
  }

  async updateHotVideo(query, params): Promise<IHotVideo> {
    let { _id, ...updateHotVideo } = params;
    return HotVideo.findOneAndUpdate(query, updateHotVideo, {
      new: true,
      upsert: true,
    }).lean();
  }

  async queryHotVideo(query: any, options?: any): Promise<any> {
    return HotVideo.aggregate(query, options);
  }

  async getTotalHotVideo(): Promise<number> {
    return HotVideo.count({}).lean();
  }

  async deleteHotVideo(query) {
    return HotVideo.deleteMany(query);
  }
}

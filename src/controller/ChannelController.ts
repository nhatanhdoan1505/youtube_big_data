import { MainService } from "../utils/MainService";
import { ChannelInfor } from "../type";
import { ChannelService } from "../models/channel/service";
import { IChannel } from "models/channel/type";

export class ChannelController {
  private mainService: MainService;
  private channelService: ChannelService = new ChannelService();

  constructor(mainService: MainService) {
    this.mainService = mainService;
  }

  async getVideosOfChannel(
    listUrl: string[],
    label: string
  ): Promise<ChannelInfor[]> {
    let channelData = await this.mainService.getChannel(listUrl);
    channelData = channelData.map((c) => {
      return { ...c, label };
    });

    return channelData;
  }

  async scanOldChannelInfor(): Promise<IChannel[]> {
    let newData = [];

    const data = await this.channelService.filterChannel({});
    const channelIds = data.map((d) => d.id);
    let newChannelInfor = await this.mainService.getChannelBasicInfor(
      channelIds
    );

    let updateChannelStatistics = newChannelInfor.map((p) => {
      let oldChannelStatistics = data.find((c) => c.id === p.id);
      let { views, subscribe, numberVideos } = oldChannelStatistics;
      let oldViews = views;
      let oldSubscribe = subscribe;
      let oldNumberVideos = numberVideos;

      return {
        ...oldChannelStatistics,
        oldViews,
        oldSubscribe,
        oldNumberVideos,
      };
    });

    for (let channel of data) {
      const idChannel: string = channel.id;
      const oldVideos = channel.videoList.filter((v) => v !== null);
      const newVideos = await this.mainService.scanNewVideos(
        oldVideos,
        idChannel
      );
      let updateVideosStatisticsPromise = oldVideos.map((v) =>
        this.mainService.updateVideosStatistics(v)
      );

      let updateVideosStatistics = await Promise.all(
        updateVideosStatisticsPromise
      );

      let channelNewInfor = updateChannelStatistics.find(
        (c) => c.id === channel.id
      );
      console.log("done");
      newData.push({ ...channelNewInfor, videoList: updateVideosStatistics });
    }

    return newData;
  }
}

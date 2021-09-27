import { IChannel } from "../models/channel/type";
import { ChannelService } from "../models/channel/service";
import {
  ChannelInfor,
  ChannelInfroApi,
  VideoFromApi,
  VideoInfor,
} from "../type";
import { ClawlService } from "./ClawlService";
import { YoutubeService } from "./YoutubeSevice";

export class MainService {
  private clawlService: ClawlService;
  private youtubeService: YoutubeService;
  private channelService: ChannelService = new ChannelService();

  constructor(clawlService: ClawlService, youtubeService: YoutubeService) {
    this.clawlService = clawlService;
    this.youtubeService = youtubeService;
  }

  async getChannelBasicInfor(ids: string[]) {
    const idEndpoint = ids.map((i) => `&id=${i}`).join("");
    const channelFromApiRes = await this.youtubeService.queryChannelSnippet(
      idEndpoint
    );
    let channelFromApi: ChannelInfroApi = channelFromApiRes.data;

    let channelBasicInfor = channelFromApi.items.map((c) => {
      return {
        urlChannel: `https://www.youtube.com/channel/${c.id}`,
        id: c.id,
        subscribe: c.statistics.subscriberCount,
        views: c.statistics.viewCount,
        title: c.snippet.title,
        numberVideos: c.statistics.videoCount,
        date: new Date().toString(),
      };
    });

    return channelBasicInfor;
  }

  async getChannel(ids: string[]) {
    let channelInfor: ChannelInfor[] = [];
    let channelBasicInfor = await this.getChannelBasicInfor(ids);

    for (let c of channelBasicInfor) {
      let videoList = await this.getVideos(c.id, +c.numberVideos);
      channelInfor.push({ ...c, videoList });
    }

    return channelInfor;
  }

  async getVideos(channelId: string, numberVideos: number) {
    let videosInfor: VideoInfor[] = [];

    let round =
      numberVideos <= 50
        ? 1
        : numberVideos % 50 !== 0
        ? Math.trunc(numberVideos / 50) + 1
        : Math.trunc(numberVideos);

    let currentPageTokens = "";
    for (let i = 0; i < round; i++) {
      let { videos, pageToken } =
        i === 0
          ? await this.getVideoPerPage(channelId)
          : await this.getVideoPerPage(channelId, currentPageTokens);
      currentPageTokens = pageToken;

      console.log({ i, length: videos.length, pageToken });
      videosInfor = [...videosInfor, ...videos];
      if (!currentPageTokens) break;
    }
    return videosInfor;
  }

  async getVideoPerPage(
    channelId: string,
    pageToken = ""
  ): Promise<{ videos: VideoInfor[]; pageToken: string }> {
    let videos: VideoInfor[] = [];

    const videosFromApiRes =
      pageToken === ""
        ? await this.youtubeService.queryVideoSnippet(channelId)
        : await this.youtubeService.queryVideoSnippet(channelId, pageToken);

    const videosFromApi: VideoFromApi = videosFromApiRes.data;

    pageToken = videosFromApi.nextPageToken;
    const videoBacisInfor = videosFromApi.items
      .filter((v) => v.id.videoId)
      .map((v) => {
        return {
          thumbnail: v.snippet.thumbnails.high.url,
          id: v.id.videoId,
          title: v.snippet.title,
          publicAt: v.snippet.publishedAt,
          date: new Date().toString(),
        };
      });

    const videosPromise = videoBacisInfor.map((v) => {
      return this.clawlService.getVideoInfor(v);
    });
    let videosData = await Promise.all(videosPromise);

    videos = [...videos, ...videosData];

    //console.log(videos);
    return { videos, pageToken };
  }

  async scanNewVideos(
    oldVideos: VideoInfor[],
    channelId: string
  ): Promise<VideoInfor[]> {
    let isEnoughPage: boolean = false;
    let newVideos: VideoInfor[] = [];
    let videoPerPage: VideoInfor[] = [];

    let currentPageTokens = "";
    do {
      let { videos, pageToken } =
        currentPageTokens === ""
          ? await this.getVideoPerPage(channelId)
          : await this.getVideoPerPage(channelId, currentPageTokens);

      currentPageTokens = pageToken;
      videoPerPage = [...videoPerPage, ...videos];
      if (videoPerPage.some((nV) => oldVideos.some((cV) => cV.id === nV.id)))
        isEnoughPage = true;
    } while (!isEnoughPage);

    newVideos = this.getNewVideo(videoPerPage, oldVideos);

    return newVideos;
  }

  getNewVideo(
    videoPerPage: VideoInfor[],
    oldVideos: VideoInfor[]
  ): VideoInfor[] {
    let newVideos: VideoInfor[] = [];

    for (let vid of videoPerPage) {
      if (!oldVideos.some((cV: VideoInfor) => cV.id === vid.id))
        newVideos = [...newVideos, vid];
    }

    return newVideos;
  }

  async updateVideosStatistics(video: VideoInfor) {
    let { views, date } = video;
    let newVideoStatistics = await this.clawlService.getVideoInfor(video);
    let newVideoInfor = newVideoStatistics
      ? {
          ...newVideoStatistics,
          views: `${views}|${newVideoStatistics.views}`,
          date: `${date}|${new Date().toString()}`,
        }
      : { ...video, views: `${views}|-1` };
    return newVideoInfor;
  }

  async updateChannelStatistics(channelInfor: {
    urlChannel: string;
    id: string;
    subscribe: number;
    views: number;
    title: string;
    numberVideos: number;
  }) {
    let oldViews = channelInfor.views;
    let oldSubscribe = channelInfor.subscribe;
    let oldNumberVideos = channelInfor.numberVideos;

    return {
      ...channelInfor,
      oldViews,
      oldNumberVideos,
      oldSubscribe,
    };
  }

  async scanOldChannelInfor() {
    let newData = [];

    const data = await this.channelService.filterChannel({});
    const channelIds = data.map((d) => d.id);
    let newChannelInfor = await this.getChannelBasicInfor(channelIds);

    let updateChannelStatistics = newChannelInfor.map((p) => {
      let oldChannelStatistics = data.find((c) => c.id === p.id);
      let { views, subscribe, numberVideos, date } = oldChannelStatistics;

      return {
        ...oldChannelStatistics,
        views: `${views}|${p.views}`,
        subscribe: `${subscribe}|${p.subscribe}`,
        numberVideos: `${numberVideos}|${p.numberVideos}`,
        date: `${date}|${new Date().toString()}`,
      };
    });

    for (let channel of data) {
      const idChannel: string = channel.id;

      const oldVideos = channel.videoList.filter((v) => v !== null);
      let updateVideosStatisticsPromise = oldVideos.map((v) =>
        this.updateVideosStatistics(v)
      );
      let updateVideosStatistics = await Promise.all(
        updateVideosStatisticsPromise
      );

      let newVideos = await this.scanNewVideos(oldVideos, idChannel);
      newVideos = newVideos.map((v) => {
        return { ...v, date: new Date().toString() };
      });

      let channelNewInfor = updateChannelStatistics.find(
        (c) => c.id === channel.id
      );

      newData.push({
        ...channelNewInfor,
        videoList: [...updateVideosStatistics, ...newVideos],
      });
      console.log("done");
    }

    return newData;
  }
}

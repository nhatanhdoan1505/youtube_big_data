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

  constructor(clawlService: ClawlService, youtubeService: YoutubeService) {
    this.clawlService = clawlService;
    this.youtubeService = youtubeService;
  }

  async getChannel(ids: string[]) {
    let channelInfor: ChannelInfor[] = [];
    const idEndpoint = ids.map((i) => `&id=${i}`).join("");
    const channelFromApiRes = await this.youtubeService.queryChannelSnippet(
      idEndpoint
    );
    let channelFromApi: ChannelInfroApi = channelFromApiRes.data;

    let channelBasicInfor = channelFromApi.items.map((c) => {
      return {
        urlChannel: `https://www.youtube.com/channel/${c.id}`,
        id: c.id,
        subscribe: +c.statistics.subscriberCount,
        views: +c.statistics.viewCount,
        title: c.snippet.title,
        numberVideos: +c.statistics.videoCount,
      };
    });

    for (let c of channelBasicInfor) {
      let videoList = await this.getVideos(c.id, c.numberVideos);
      channelInfor.push({ ...c, videoList });
    }

    return channelInfor;
  }

  async getVideos(channelId: string, numberVideos: number) {
    let videos: VideoInfor[] = [];

    let round =
      numberVideos <= 50
        ? 1
        : numberVideos % 50 !== 0
        ? Math.trunc(numberVideos / 50) + 1
        : Math.trunc(numberVideos);

    let pageToken = "";
    for (let i = 0; i < round; i++) {
      const videosFromApiRes =
        i === 0
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
          };
        });

      const videosPromise = videoBacisInfor.map((v) => {
        return this.clawlService.getVideoInfor(v);
      });
      const videosData = await Promise.all(videosPromise);
      videos = [...videos, ...videosData];
      console.log(videosData);
    }
    return videos;
  }
}

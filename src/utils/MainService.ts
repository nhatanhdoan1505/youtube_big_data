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
        subscribe: +c.statistics.subscriberCount,
        views: +c.statistics.viewCount,
        title: c.snippet.title,
        numberVideos: +c.statistics.videoCount,
      };
    });

    return channelBasicInfor;
  }

  async getChannel(ids: string[]) {
    let channelInfor: ChannelInfor[] = [];
    let channelBasicInfor = await this.getChannelBasicInfor(ids);

    for (let c of channelBasicInfor) {
      let videoList = await this.getVideos(c.id, c.numberVideos);
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

      videosInfor = [...videosInfor, ...videos];
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
        };
      });

    const videosPromise = videoBacisInfor.map((v) => {
      return this.clawlService.getVideoInfor(v);
    });
    const videosData = await Promise.all(videosPromise);
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
    let oldViews = video.views;
    let newVideoStatistics = await this.clawlService.getVideoInfor(video);
    let newVideoInfor = newVideoStatistics
      ? { ...newVideoStatistics, oldViews }
      : { ...video, oldViews, views: -1 };
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
}

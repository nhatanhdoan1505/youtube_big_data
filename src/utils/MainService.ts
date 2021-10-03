import { ChannelService } from "../models/channel/service";
import {
  ChannelInfor,
  ChannelInfroApi,
  VideoFromApi,
  VideoInfor,
  VideoStatisticsApi,
} from "../type";
import { YoutubeService } from "./YoutubeSevice";

export class MainService {
  private youtubeService: YoutubeService;
  private channelService: ChannelService = new ChannelService();

  constructor(youtubeService: YoutubeService) {
    this.youtubeService = youtubeService;
  }

  resetApiKey() {
    return this.youtubeService.resetApiKey();
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
        channelThumnail: c.snippet.thumbnails.high.url,
        date: new Date().toString(),
      };
    });

    return channelBasicInfor;
  }

  async getChannel(ids: string[]) {
    let channelInfor: ChannelInfor[] = [];
    let channelBasicInfor = await this.getChannelBasicInfor(ids);

    for (let c of channelBasicInfor) {
      let videoList = await this.getVideos(c.id);
      channelInfor.push({ ...c, videoList });
    }

    return channelInfor;
  }

  async getVideos(channelId: string) {
    let videosInfor: VideoInfor[] = [];
    let currentPageTokens = "";
    let i = 0;
    while (currentPageTokens !== undefined) {
      let { videos, pageToken } =
        i === 0
          ? await this.getVideoPerPage(channelId)
          : await this.getVideoPerPage(channelId, currentPageTokens);
      currentPageTokens = pageToken;

      console.log({ i, length: videos.length, pageToken });
      videosInfor = [...videosInfor, ...videos];
      i += 1;
    }
    return videosInfor;
  }

  async getVideoPerPage(
    channelId: string,
    pageToken = ""
  ): Promise<{ videos: VideoInfor[]; pageToken: string }> {
    const videosFromApiRes =
      pageToken === ""
        ? await this.youtubeService.queryVideoSnippet(channelId)
        : await this.youtubeService.queryVideoSnippet(channelId, pageToken);

    const videosFromApi: VideoFromApi = videosFromApiRes.data;

    pageToken = videosFromApi.nextPageToken;
    const videoBasicInfor = videosFromApi.items
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

    let videos = await this.getVideoFullInfor(videoBasicInfor);
    return { videos, pageToken };
  }

  async getVideoFullInfor(
    videoBasicInfor: {
      thumbnail: string;
      id: string;
      title: string;
      publicAt: string;
      date: string;
    }[]
  ): Promise<VideoInfor[]> {
    let idEndpoint = videoBasicInfor
      .map((v) => v.id)
      .map((id) => `&id=${id}`)
      .join("");
    const videoStatisticsApiRes =
      await this.youtubeService.queryVideoStatistics(idEndpoint);

    const videoStatisticsFromApi: VideoStatisticsApi =
      videoStatisticsApiRes.data;
    const videosData: VideoInfor[] = videoBasicInfor.map((vBasic) => {
      let videoStatistic: { likes: number; dislikes: number; views: string } = {
        likes: -1,
        dislikes: -1,
        views: "",
      };
      const video = videoStatisticsFromApi.items.find(
        (vStatistics) => vBasic.id === vStatistics.id
      );
      videoStatistic = {
        likes: +video.statistics.likeCount,
        dislikes: +video.statistics.dislikeCount,
        views: video.statistics.viewCount,
      };
      return {
        ...vBasic,
        ...videoStatistic,
        days: Math.floor(
          Math.abs(new Date().getTime() - new Date(vBasic.publicAt).getTime()) /
            86400000
        ),
      };
    });

    return videosData;
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

  async updateVideosStatistics(videos: VideoInfor[]) {
    const newVideoStatistics: VideoInfor[] = await this.getVideoFullInfor(
      videos
    );
    const newVideoInfor = videos.map((oldV) => {
      let { views, date } = oldV;
      let video = newVideoStatistics.find((v) => v.id === oldV.id);
      return {
        ...oldV,
        likes: video.likes,
        dislikes: video.dislikes,
        days: video.days,
        views: `${views}|${video.views}`,
        date: `${date}|${new Date().toString()}`,
      };
    });

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
      let updateVideosStatistics = await this.updateVideosStatistics(oldVideos);

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

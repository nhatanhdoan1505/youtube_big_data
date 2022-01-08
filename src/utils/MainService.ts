import { IChannel } from "models/channel/type";
import { ChannelService } from "../models/channel/service";
import {
  ChannelIdFromAPI,
  ChannelInfor,
  ChannelInfroApi,
  VideoFromApi,
  VideoInfor,
  VideoStatistics,
  VideoStatisticsApi,
} from "../type";
import { YoutubeService } from "./YoutubeSevice";

export class MainService {
  private youtubeService: YoutubeService;
  private channelService: ChannelService = new ChannelService();

  constructor(youtubeService: YoutubeService) {
    this.youtubeService = youtubeService;
  }

  getAllKey() {
    return this.youtubeService.getAllKey();
  }

  resetApiKey(apiKey?: string[]) {
    return this.youtubeService.resetApiKey(apiKey);
  }

  async test(id) {
    return await this.youtubeService.queryChannelSnippet(id);
  }

  async getChannelId(userNameList: string[]) {
    let idList: string[] = [];
    for (let userName of userNameList) {
      let response = await this.youtubeService.queryChannelId(userName);
      if (!response) continue;
      if (!response.data) continue;
      let idRes: ChannelIdFromAPI = response.data;
      if (idRes.items) idList = [...idList, idRes.items[0].id];
    }
    return idList;
  }

  async getChannelBasicInfor(ids: string[]) {
    let channelFromApiList: ChannelInfroApi[] = [];
    let index = 0;
    while (index < ids.length) {
      let endPoint = ids
        .slice(index, index + 50)
        .map((id) => `&id=${id}`)
        .join("");
      const channelFromApiRes = await this.youtubeService.queryChannelSnippet(
        endPoint
      );

      let channelFromApi: ChannelInfroApi = channelFromApiRes.data;
      channelFromApiList = [...channelFromApiList, channelFromApi];
      index += 50;
    }

    let channelBasicInfor = channelFromApiList
      .map((channel) =>
        channel.items.map((c) => ({
          urlChannel: `https://www.youtube.com/channel/${c.id}`,
          id: c.id,
          subscribe: c.statistics.subscriberCount,
          views: c.statistics.viewCount,
          title: c.snippet.title,
          numberVideos: c.statistics.videoCount,
          channelThumnail: c.snippet.thumbnails.high.url,
          date: new Date().toString(),
        }))
      )
      .reduce((a, b) => a.concat(b), []);

    console.log("DONE GET CHANNEL SNIPPET", channelBasicInfor.length);

    return channelBasicInfor;
  }

  async getChannel(ids: string[]) {
    let channelInfor: ChannelInfor[] = [];
    let channelBasicInfor = await this.getChannelBasicInfor(ids);

    let index = 0;
    for (let c of channelBasicInfor) {
      console.log(
        `GET CHANNEL ${c.title} ${index + 1}/${channelBasicInfor.length}`
      );
      let videoList = await this.getVideos(c.id);
      channelInfor.push({ ...c, videoList });
      index += 1;
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
    let videosFromApi: VideoStatisticsApi[] = [];
    let idEndpoint = videoBasicInfor.map((v) => v.id);
    let index = 0;
    console.log(`Get ${videoBasicInfor.length} videos`);
    while (index < idEndpoint.length) {
      console.log(Math.floor(index / 50) + 1 + " loop");
      let endPoint = idEndpoint
        .slice(index, index + 50)
        .map((id) => `&id=${id}`)
        .join("");
      const videoStatisticsApiRes =
        await this.youtubeService.queryVideoStatistics(endPoint);
      const videoStatisticsFromApi: VideoStatisticsApi =
        videoStatisticsApiRes.data;
      videosFromApi = [...videosFromApi, videoStatisticsFromApi];
      index += 50;
    }

    let videosStatistic = videosFromApi
      .map((v) => v.items)
      .reduce((pre, next) => pre.concat(next), []);

    const videosData: VideoInfor[] = videoBasicInfor.map((vBasic) => {
      let videoStatistic: VideoStatistics = {
        likes: "-1",
        dislikes: "-1",
        views: "",
      };
      const video = videosStatistic.find(
        (vStatistics) => vBasic.id === vStatistics.id
      );

      videoStatistic = {
        likes: video ? video.statistics.likeCount : "-1",
        dislikes: video ? video.statistics.dislikeCount : "-1",
        views: video ? video.statistics.viewCount : "-1",
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

    let index = 1;
    do {
      console.log(`${index} loop`);
      let { videos, pageToken } =
        currentPageTokens === ""
          ? await this.getVideoPerPage(channelId)
          : await this.getVideoPerPage(channelId, currentPageTokens);

      currentPageTokens = pageToken;
      videoPerPage = [...videoPerPage, ...videos];

      if (videoPerPage.some((nV) => oldVideos.some((cV) => cV.id === nV.id)))
        isEnoughPage = true;

      if (!pageToken) break;
      index += 1;
    } while (!isEnoughPage);

    newVideos = this.getNewVideo(videoPerPage, oldVideos);

    console.log(`Get ${newVideos.length} new videos`);
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
    const videoNewStatistics: VideoInfor[] = await this.getVideoFullInfor(
      videos
    );

    const videoNewInfor = videos.map((oldV) => {
      let { views, date } = oldV;
      let video = videoNewStatistics.find((v) => v.id === oldV.id);
      return {
        ...oldV,
        likes: video.likes,
        dislikes: video.dislikes,
        days: video.days,
        views: `${views}|${video.views}`,
        date: `${date}|${new Date().toString()}`,
      };
    });
    return videoNewInfor;
  }

  async scanOldChannelInfor(data: IChannel[]) {
    let newData = [];

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

    data = data.filter((channel) =>
      newChannelInfor.some((c) => c.id === channel.id)
    );

    console.log("Done update channel infor");
    for (let channel of data) {
      console.log("Update old video infor", channel.title);
      const idChannel: string = channel.id;

      const oldVideos = channel.videoList.filter((v) => v !== null);
      let updateVideosStatistics = await this.updateVideosStatistics(oldVideos);

      console.log(`Done for old video ${channel.title}`);

      console.log(`Scan new video ${channel.title}`);
      let newVideos = await this.scanNewVideos(oldVideos, idChannel);

      newVideos = newVideos.map((v) => {
        return { ...v, date: new Date().toString() };
      });

      console.log(`Done for new video ${channel.title}`);

      let channelNewInfor = updateChannelStatistics.find(
        (c) => c.id === channel.id
      );

      newData.push({
        ...channelNewInfor,
        videoList: [...updateVideosStatistics, ...newVideos],
      });
      console.log(`done ${channel.title}`);
      console.log(`-----------------------`);
    }

    return newData;
  }
}

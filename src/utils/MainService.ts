import {
  IChannel,
  IVideo,
  VideoStatistic,
  VideoDescription,
  IChannelBaseInformation,
} from "models/channel/type";
import { ChannelService } from "../models/channel/service";
import {
  ChannelIdFromAPI,
  // ChannelInformation,
  ChannelInformationApi,
  VideoInformationApi,
  // IVideo,
  VideoListFromApi,
} from "../type";
import { YoutubeService } from "./YoutubeService";

export class MainService {
  private youtubeService: YoutubeService = new YoutubeService();

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

  async getChannelBasicInformation(
    ids: string[]
  ): Promise<IChannelBaseInformation[]> {
    let channelFromApiList: ChannelInformationApi[] = [];
    let index = 0;
    while (index < ids.length) {
      let endPoint = ids
        .slice(index, index + 50)
        .map((id) => `&id=${id}`)
        .join("");
      const channelFromApiRes = await this.youtubeService.queryChannelSnippet(
        endPoint
      );

      let channelFromApi: ChannelInformationApi = channelFromApiRes.data;
      channelFromApiList = [...channelFromApiList, channelFromApi];
      index += 50;
    }

    let channelBasicInformation = channelFromApiList
      .filter((c) => c.items)
      .map((channel) =>
        channel.items.map((c) => {
          if (!c.snippet.publishedAt)
            return {
              urlChannel: `https://www.youtube.com/channel/${c.id}`,
              id: c.id,
              subscribe: c.statistics.subscriberCount,
              views: c.statistics.viewCount,
              title: c.snippet.title,
              numberVideos: c.statistics.videoCount,
              channelThumbnail: c.snippet.thumbnails.high.url,
              date: new Date().toString(),
              bannerExternalUrl: c.brandingSettings.image
                ? c.brandingSettings.image.bannerExternalUrl
                : "",
              description: c.snippet.description ? c.snippet.description : "",
              tags: c.brandingSettings.channel.keywords
                ? c.brandingSettings.channel.keywords
                : "",
            };

          return {
            urlChannel: `https://www.youtube.com/channel/${c.id}`,
            id: c.id,
            subscribe: c.statistics.subscriberCount,
            views: c.statistics.viewCount,
            title: c.snippet.title,
            numberVideos: c.statistics.videoCount,
            channelThumbnail: c.snippet.thumbnails.high.url,
            date: new Date().toString(),
            bannerExternalUrl: c.brandingSettings.image
              ? c.brandingSettings.image.bannerExternalUrl
              : "",
            publishedAt: new Date(c.snippet.publishedAt),
            description: c.snippet.description ? c.snippet.description : "",
            tags: c.brandingSettings.channel.keywords
              ? c.brandingSettings.channel.keywords
              : "",
          };
        })
      )
      .reduce((a, b) => a.concat(b), []);

    console.log("DONE GET CHANNEL SNIPPET", channelBasicInformation.length);

    return channelBasicInformation;
  }

  async getChannel(ids: string[]): Promise<IChannel[]> {
    let channelInformation: IChannel[] = [];
    let channelBasicInformation = await this.getChannelBasicInformation(ids);

    let index = 0;
    for (let c of channelBasicInformation) {
      console.log(
        `GET CHANNEL ${c.title} ${index + 1}/${channelBasicInformation.length}`
      );
      let videoList = await this.getVideos(c.id);
      channelInformation.push({ ...c, videoList });
      index += 1;
    }

    return channelInformation;
  }

  async getVideos(channelId: string): Promise<IVideo[]> {
    let videosInformation: IVideo[] = [];
    let currentPageTokens = "";
    let i = 0;
    while (currentPageTokens !== undefined) {
      let { videos, pageToken } =
        i === 0
          ? await this.getVideoPerPage(channelId)
          : await this.getVideoPerPage(channelId, currentPageTokens);
      currentPageTokens = pageToken;

      console.log({ i, length: videos.length, pageToken });
      videosInformation = [...videosInformation, ...videos];
      i += 1;
    }
    return videosInformation;
  }

  async getVideoPerPage(
    channelId: string,
    pageToken = ""
  ): Promise<{ videos: IVideo[]; pageToken: string }> {
    const videosFromApiRes =
      pageToken === ""
        ? await this.youtubeService.queryVideoListOfChannel(channelId)
        : await this.youtubeService.queryVideoListOfChannel(
            channelId,
            pageToken
          );
    const videosFromApi: VideoListFromApi = videosFromApiRes.data;

    pageToken = videosFromApi.nextPageToken;
    const videoBasicInformation = videosFromApi.items
      .filter((v) => v.id.videoId)
      .map((v) => {
        if (!v.snippet.publishedAt)
          return {
            thumbnail: v.snippet.thumbnails.high.url,
            id: v.id.videoId,
            title: v.snippet.title,
            date: new Date().toString(),
          };
        return {
          thumbnail: v.snippet.thumbnails.high.url,
          id: v.id.videoId,
          title: v.snippet.title,
          publicAt: new Date(v.snippet.publishedAt),
          date: new Date().toString(),
        };
      });

    let videos = await this.getVideoFullInformation(videoBasicInformation);
    return { videos, pageToken };
  }

  async requestIVideoFromApi(idEndpoint: string[]) {
    let endPoint = idEndpoint.map((id) => `&id=${id}`).join("");
    const IVideoApiRes = await this.youtubeService.queryVideoInformation(
      endPoint
    );
    const videoStatisticsFromApi: VideoInformationApi = IVideoApiRes.data;

    return videoStatisticsFromApi;
  }

  async getVideoFullInformation(
    videoBasicInformation: {
      thumbnail: string;
      id: string;
      title: string;
      publicAt?: Date;
      date: string;
    }[]
  ): Promise<IVideo[]> {
    let videosInformationFromApi: VideoInformationApi[] = [];

    let idEndpoint = videoBasicInformation.map((v) => v.id);
    let index = 0;
    console.log(`Get ${videoBasicInformation.length} videos`);
    while (index < idEndpoint.length) {
      console.log(Math.floor(index / 50) + 1 + " loop");
      let endPoint = idEndpoint.slice(index, index + 50);
      const videoFromApi = await this.requestIVideoFromApi(endPoint);
      videosInformationFromApi = [...videosInformationFromApi, videoFromApi];
      index += 50;
    }

    let videoList = videosInformationFromApi
      .map((v) => v.items)
      .reduce((pre, next) => pre.concat(next), []);

    const videosData: IVideo[] = videoBasicInformation.map((vBasic) => {
      let videoStatistic: VideoStatistic = {
        likes: "",
        dislikes: "",
        views: "",
        commentCount: "",
      };
      let videoDescription: VideoDescription = {
        description: "",
        tags: [],
        madeForKids: false,
        duration: "",
      };
      const videosData = videoList.find((v) => vBasic.id === v.id);

      videoStatistic = {
        likes: videosData ? videosData.statistics.likeCount : "-1",
        dislikes: videosData ? videosData.statistics.dislikeCount : "-1",
        views: videosData ? videosData.statistics.viewCount : "-1",
        commentCount: videosData ? videosData.statistics.commentCount : "-1",
      };
      videoDescription = {
        description: videosData ? videosData.snippet.description : "",
        tags: videosData ? videosData.snippet.tags : [],
        madeForKids: videosData ? videosData.status.madeForKids : false,
        duration: videosData ? videosData.contentDetails.duration : "",
      };
      return {
        ...vBasic,
        ...videoStatistic,
        ...videoDescription,
        days: Math.floor(
          Math.abs(new Date().getTime() - new Date(vBasic.publicAt).getTime()) /
            86400000
        ),
      };
    });

    return videosData;
  }

  async scanNewVideos(
    oldVideos: IVideo[],
    channelId: string
  ): Promise<IVideo[]> {
    let isEnoughPage: boolean = false;
    let newVideos: IVideo[] = [];
    let videoPerPage: IVideo[] = [];

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

  getNewVideo(videoPerPage: IVideo[], oldVideos: IVideo[]): IVideo[] {
    let newVideos: IVideo[] = [];

    for (let vid of videoPerPage) {
      if (!oldVideos.some((cV: IVideo) => cV.id === vid.id))
        newVideos = [...newVideos, vid];
    }

    return newVideos;
  }

  async updateVideosInformation(videos: IVideo[]) {
    const newInformation: IVideo[] = await this.getVideoFullInformation(videos);

    const videoNewInformation = videos.map((oldV) => {
      let { views, date, likes, dislikes, commentCount } = oldV;
      let video = newInformation.find((v) => v.id === oldV.id);
      return {
        ...oldV,
        commentCount: `${commentCount}|${video.commentCount}`,
        likes: `${likes}|${video.likes}`,
        dislikes: `${dislikes}|${video.dislikes}`,
        days: video.days,
        description: video.description,
        tags: video.tags,
        madeForKids: video.madeForKids,
        duration: video.duration,
        views: `${views}|${video.views}`,
        date: `${date}|${new Date().toString()}`,
      };
    });
    return videoNewInformation;
  }

  async scanOldChannelInformation(data: IChannel[]) {
    let newData = [];

    const channelIds = data.map((d) => d.id);
    let newChannelInformation = await this.getChannelBasicInformation(
      channelIds
    );

    let updateChannelStatistics = newChannelInformation.map((p) => {
      let oldChannelStatistics = data.find((c) => c.id === p.id);
      let { views, subscribe, numberVideos, date } = oldChannelStatistics;

      return {
        ...p,
        views: `${views}|${p.views}`,
        subscribe: `${subscribe}|${p.subscribe}`,
        numberVideos: `${numberVideos}|${p.numberVideos}`,
        date: `${date}|${new Date().toString()}`,
      };
    });

    data = data.filter((channel) =>
      newChannelInformation.some((c) => c.id === channel.id)
    );

    console.log("Done update channel information");
    for (let channel of data) {
      console.log("Update old video information", channel.title);
      const idChannel: string = channel.id;

      const oldVideos = channel.videoList.filter((v) => v !== null);
      let updateVideosInformation = await this.updateVideosInformation(
        oldVideos
      );

      console.log(`Done for old video ${channel.title}`);

      console.log(`Scan new video ${channel.title}`);
      let newVideos = await this.scanNewVideos(oldVideos, idChannel);

      newVideos = newVideos.map((v) => {
        return { ...v, date: new Date().toString() };
      });

      console.log(`Done for new video ${channel.title}`);

      let channelNewInformation = updateChannelStatistics.find(
        (c) => c.id === channel.id
      );

      newData.push({
        ...channelNewInformation,
        videoList: [...updateVideosInformation, ...newVideos],
      });
      console.log(`done ${channel.title}`);
      console.log(`-----------------------`);
    }

    return newData;
  }
}

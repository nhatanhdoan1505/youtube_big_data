import { IChannel } from "./../models/channel/type";
import { MainService } from "./../utils/MainService";
import { ChannelService } from "./../models/channel/service";
import { HotChannelService } from "./../models/channel-hot/service";
import { HotVideoService } from "./../models/video-hot/service";
import * as _ from "lodash";
import { Server, Socket } from "socket.io";
import { EVENT } from "../module/common";
import { IHotVideo } from "models/video-hot/type";
import moment from "moment";
import { detectKeyword } from "../utils/common";
import { Emitter } from "../module/emitter";

export class YoutubeHandler {
  private channelService: ChannelService = new ChannelService();
  private hotVideoService: HotVideoService = new HotVideoService();
  private hotChannelService: HotChannelService = new HotChannelService();
  private mainService: MainService = new MainService();
  private io: Server;

  private ready: boolean = true;
  private loading: number = 0;
  private serviceRunning: "UPDATE" | "GET" | "OPTIMIZE" = null;
  private numberWorked: number = 0;
  private total: number = 0;
  emitter: Emitter;

  constructor(io: Server) {
    this.io = io;
    this.emitter = new Emitter(this.io);
  }

  serverReady() {
    this.ready = true;
    this.serviceRunning = null;
  }

  async updateHotVideo({ label }: { label: string }) {
    if (!this.ready)
      return this.emitter.serverStatus({
        ready: this.ready,
        serviceRunning: this.serviceRunning,
      });

    this.ready = false;
    this.serviceRunning = "OPTIMIZE";

    let totalData = label
      ? (
          await this.channelService.queryChannel([
            { $match: { label } },
            { $project: { _id: 1 } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ])
        )[0].count
      : (
          await this.channelService.queryChannel([
            { $project: { _id: 1 } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ])
        )[0].count;

    this.total = totalData;
    this.numberWorked = 0;
    this.emitter.serverStatus({
      ready: this.ready,
      serviceRunning: this.serviceRunning,
      total: this.total,
      numberWorked: this.numberWorked,
    });

    let skip = 0;
    let numberLoop =
      totalData % 5 === 0
        ? Math.floor(totalData / 5)
        : Math.floor(totalData / 5) + 1;
    let j = 0;
    let channelData: IChannel[] = [];
    while (j < numberLoop) {
      channelData = label
        ? await this.channelService.queryChannel([
            { $match: { label } },
            { $skip: skip },
            { $limit: 5 },
          ])
        : await this.channelService.queryChannel([
            { $skip: skip },
            { $limit: 5 },
          ]);
      let videoList = channelData
        .map((c) => {
          let { videoList, ...channelInformation } = c;
          return videoList.map((v) => ({
            ...v,
            channelInformation,
          }));
        })
        .reduce((pre, next) => pre.concat(next));

      let i = 0;

      while (i < videoList.length) {
        let data = videoList.slice(i, i + 10);
        let videoData: IHotVideo[] = data.map((v) => {
          let gapViews =
            +_.nth(v.views.split("|"), -1) - +_.nth(v.views.split("|"), -2);
          let gapLikes =
            +_.nth(v.likes.split("|"), -1) - +_.nth(v.likes.split("|"), -2);
          let gapDislikes =
            +_.nth((v.dislikes.split("|"), -1)) -
            +_.nth(v.dislikes.split("|"), -2);
          let gapCommentsCount =
            +_.nth(v.commentCount.split("|"), -1) -
            +_.nth(v.commentCount.split("|"), 2);

          if (!v.publicAt)
            return {
              ...v,
              likesHistory: v.likes,
              dislikesHistory: v.dislikes,
              commentCountHistory: v.commentCount,
              viewsHistory: v.views,
              views: +_.nth(v.views.split("|"), -1)
                ? +_.nth(v.views.split("|"), -1)
                : -1,
              likes: +_.nth(v.likes.split("|"), -1)
                ? +_.nth(v.likes.split("|"), -1)
                : -1,
              dislikes: -1,
              commentCount: +_.nth(v.commentCount.split("|"), -1)
                ? +_.nth(v.commentCount.split("|"), -1)
                : -1,
              gapViews: +gapViews ? gapViews : 0,
              gapLikes: +gapLikes ? gapLikes : 0,
              gapDislikes: gapDislikes ? gapDislikes : 0,
              gapCommentsCount: gapCommentsCount ? gapCommentsCount : 0,
              duration: moment.duration(v.duration).asSeconds()
                ? moment.duration(v.duration).asSeconds()
                : 0,
              keywords: detectKeyword(v.title),
            };

          return {
            ...v,
            likesHistory: v.likes,
            dislikesHistory: v.dislikes,
            commentCountHistory: v.commentCount,
            viewsHistory: v.views,
            views: +_.nth(v.views.split("|"), -1)
              ? +_.nth(v.views.split("|"), -1)
              : -1,
            likes: +_.nth(v.likes.split("|"), -1)
              ? +_.nth(v.likes.split("|"), -1)
              : -1,
            dislikes: -1,
            commentCount: +_.nth(v.commentCount.split("|"), -1)
              ? +_.nth(v.commentCount.split("|"), -1)
              : -1,
            gapViews: +gapViews ? gapViews : 0,
            gapLikes: +gapLikes ? gapLikes : 0,
            gapDislikes: gapDislikes ? gapDislikes : 0,
            gapCommentsCount: gapCommentsCount ? gapCommentsCount : 0,
            duration: moment.duration(v.duration).asSeconds()
              ? moment.duration(v.duration).asSeconds()
              : 0,
            publicAt: new Date(v.publicAt),
            keywords: detectKeyword(v.title),
          };
        });

        const saveDataPromise = videoData.map((v) =>
          this.hotVideoService.updateHotVideo({ id: v.id }, v)
        );

        await Promise.all(saveDataPromise);

        this.numberWorked += videoData.length;
        this.emitter.serverStatus({
          ready: this.ready,
          serviceRunning: this.serviceRunning,
          total: this.total,
          numberWorked: this.numberWorked,
        });
        i += 10;
      }
      skip += 5;
      j += 1;
      this.numberWorked += 5;

      this.emitter.serverStatus({
        ready: this.ready,
        serviceRunning: this.serviceRunning,
        total: this.total,
        numberWorked: this.numberWorked,
      });
    }

    this.serverReady();
    return this.emitter.serverStatus({
      ready: this.ready,
      serviceRunning: this.serviceRunning,
      total: this.total,
      numberWorked: this.numberWorked,
    });
  }

  async updateHotChannel({ label }: { label: string }) {
    if (!this.ready)
      return this.emitter.serverStatus({
        ready: this.ready,
        serviceRunning: this.serviceRunning,
      });

    this.ready = false;
    this.serviceRunning = "OPTIMIZE";

    let totalData = label
      ? (
          await this.channelService.queryChannel([
            { $match: { label } },
            { $project: { _id: 1 } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ])
        )[0].count
      : (
          await this.channelService.queryChannel([
            { $project: { _id: 1 } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ])
        )[0].count;
    console.log(totalData);
    this.total = totalData;
    this.numberWorked = 0;
    this.emitter.serverStatus({
      ready: this.ready,
      serviceRunning: this.serviceRunning,
      total: this.total,
      numberWorked: this.numberWorked,
    });

    let skip = 0;
    let numberLoop =
      totalData % 50 === 0
        ? Math.floor(totalData / 50)
        : Math.floor(totalData / 50) + 1;
    let j = 0;

    let channelList;
    let channelListSort;
    while (j < numberLoop) {
      console.log("j");
      channelList = label
        ? await this.channelService.queryChannel([
            { $match: { label } },
            { $skip: skip },
            { $limit: 50 },
          ])
        : await this.channelService.queryChannel([
            { $skip: skip },
            { $limit: 50 },
          ]);
      channelListSort = channelList.map((c) => {
        let {
          videoList,
          subscribe,
          views,
          numberVideos,
          publishedAt,
          ...channelInfo
        } = c;
        let gapViews =
          views.split("|").length > 1
            ? +_.nth(views.split("|"), -1) - +_.nth(views.split("|"), -2)
            : 0;
        let viewsHistory = views;
        views = _.nth(views.split("|"), -1);
        let subscribesHistory = subscribe;
        let gapSubscribes =
          subscribe.split("|").length > 1
            ? +_.nth(subscribe.split("|"), -1) -
              +_.nth(subscribe.split("|"), -2)
            : 0;
        subscribe = _.nth(subscribe.split("|"), -1);
        let gapNumberVideos =
          numberVideos.split("|").length > 1
            ? +_.nth(numberVideos.split("|"), -1) -
              +_.nth(numberVideos.split("|"), -2)
            : 0;
        let numberVideosHistory = numberVideos;
        numberVideos = _.nth(numberVideos.split("|"), -1);

        if (!publishedAt)
          return {
            ...channelInfo,
            views: +views ? +views : -1,
            numberVideos: +numberVideos ? +numberVideos : -1,
            subscribe: +subscribe ? +subscribe : -1,
            gapNumberVideos: gapNumberVideos ? gapNumberVideos : 0,
            gapSubscribes: gapSubscribes ? gapSubscribes : 0,
            gapViews: gapViews ? gapViews : 0,
            viewsHistory,
            subscribesHistory,
            numberVideosHistory,
          };

        return {
          ...channelInfo,
          views: +views ? +views : -1,
          numberVideos: +numberVideos ? +numberVideos : -1,
          subscribe: +subscribe ? +subscribe : -1,
          gapNumberVideos: gapNumberVideos ? gapNumberVideos : 0,
          gapSubscribes: gapSubscribes ? gapSubscribes : 0,
          gapViews: gapViews ? gapViews : 0,
          viewsHistory,
          subscribesHistory,
          numberVideosHistory,
          publishedAt: new Date(publishedAt) ? new Date(publishedAt) : null,
          averageUpload:
            +numberVideos > 0
              ? (Date.now() - publishedAt.getTime()) / 604800000 / +numberVideos
              : null,
        };
      });
      const saveDataPromise = channelListSort.map((v) =>
        this.hotChannelService.updateHotChannel({ id: v.id }, v)
      );
      await Promise.all(saveDataPromise);
      skip += 50;
      j += 1;

      this.numberWorked += 50;
      this.emitter.serverStatus({
        ready: this.ready,
        serviceRunning: this.serviceRunning,
        total: this.total,
        numberWorked: this.numberWorked,
      });
    }

    this.serverReady();
    return this.emitter.serverStatus({
      ready: this.ready,
      serviceRunning: this.serviceRunning,
      total: this.total,
      numberWorked: this.numberWorked,
    });
  }

  async getNewChannel({ url, label }: { url: string; label: string }) {
    if (!this.ready)
      return this.emitter.serverStatus({
        ready: this.ready,
        serviceRunning: this.serviceRunning,
      });

    this.ready = false;
    this.serviceRunning = "GET";

    let existChannel = (
      await this.channelService.queryChannel([
        { $match: { label } },
        { $project: { id: 1 } },
      ])
    ).map((c) => c.id);

    let listUrl = url.split(",").map((url) => {
      if (url[url.length - 1] === "/") {
        url = url.slice(0, url.length - 1);
      }
      return url;
    });
    let listId: string[] = listUrl
      .filter((url) => url.includes("channel"))
      .map((url) => url.replace("//", ""))
      .map((url) => url.split("/"))
      .map((url) => url[url.length - 1]);
    listId = _.uniq(listId);
    listId = _.xor(listId, existChannel);

    let listUserName = listUrl
      .filter((url) => !url.includes("channel"))
      .map((url) => url.replace("//", ""))
      .map((url) => url.split("/"))
      .map((url) => url[url.length - 1])
      .filter((url) => url !== "");

    let idFromUser = await this.mainService.getChannelId(listUserName);
    listId = [...listId, ...idFromUser];
    listId = _.uniq(listId);

    if (listId.length === 0) {
      this.emitter.serverStatus({
        ready: this.ready,
        serviceRunning: this.serviceRunning,
      });

      return this.serverReady();
    }

    let i = 0;
    let channelList: IChannel[] = [];

    this.total = listId.length;
    this.numberWorked = 0;

    this.emitter.serverStatus({
      ready: this.ready,
      serviceRunning: this.serviceRunning,
      total: this.total,
      numberWorked: this.numberWorked,
    });

    while (i < listId.length) {
      channelList = await this.mainService.getChannel(listId.slice(i, i + 5));

      channelList = channelList.map((c) => {
        return { ...c, label };
      });

      const saveDataPromise = channelList.map((c: IChannel) =>
        this.channelService.createChannel(c)
      );
      await Promise.all(saveDataPromise);
      i += 5;

      this.numberWorked = i;
      this.emitter.serverStatus({
        ready: this.ready,
        serviceRunning: this.serviceRunning,
        total: this.total,
        numberWorked: this.numberWorked,
      });
    }

    this.serverReady();
    return this.emitter.serverStatus({
      ready: this.ready,
      serviceRunning: this.serviceRunning,
      total: this.total,
      numberWorked: this.numberWorked,
    });
  }

  async updateChannelInformation({ label }: { label?: string }) {
    if (!this.ready)
      return this.emitter.serverStatus({
        ready: this.ready,
        serviceRunning: this.serviceRunning,
      });

    this.ready = false;
    this.serviceRunning = "UPDATE";
    const totalData = label
      ? (
          await this.channelService.queryChannel([
            { $match: { label } },
            { $group: { _id: null, count: { $sum: 1 } } },
          ])
        )[0].count
      : (
          await this.channelService.queryChannel([
            { $group: { _id: null, count: { $sum: 1 } } },
          ])
        )[0].count;

    let skip = 0;
    let data;

    this.total = totalData;
    this.numberWorked = 0;

    this.emitter.serverStatus({
      ready: this.ready,
      serviceRunning: this.serviceRunning,
      total: this.total,
      numberWorked: this.numberWorked,
    });

    let numberLoop =
      totalData % 50 === 0
        ? Math.floor(totalData / 50)
        : Math.floor(totalData / 50) + 1;
    let j = 0;
    while (j < numberLoop) {
      data = label
        ? await this.channelService.queryChannel([
            { $match: { label } },
            { $skip: skip },
            { $limit: 50 },
          ])
        : await this.channelService.queryChannel([
            { $skip: skip },
            { $limit: 50 },
          ]);

      let i = 0;
      let newData: IChannel[];

      while (i < data.length) {
        newData = await this.mainService.scanOldChannelInformation(
          data.slice(i, i + 5)
        );

        const updateChannelPromise = newData.map((c) =>
          this.channelService.updateChannel({ id: c.id }, c)
        );

        await Promise.all(updateChannelPromise);
        i += 5;

        this.numberWorked += 5;
        this.emitter.serverStatus({
          ready: this.ready,
          serviceRunning: this.serviceRunning,
          total: this.total,
          numberWorked: this.numberWorked,
        });
      }
      skip += 50;
      j += 1;
    }

    this.serverReady();
    return this.emitter.serverStatus({
      ready: this.ready,
      serviceRunning: this.serviceRunning,
      total: this.total,
      numberWorked: this.numberWorked,
    });
  }

  getServerStatus({ socket }: { socket: Socket }) {
    return socket.emit(EVENT.SERVER_READY, {
      data: {
        ready: this.ready,
        serviceRunning: this.serviceRunning,
        total: this.total,
        numberWorked: this.numberWorked,
      },
    });
  }
}

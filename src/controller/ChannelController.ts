import { ChannelService } from "../models/channel/service";
import { HotVideoService } from "../models/video-hot/service";
import { HotChannelService } from "../models/channel-hot/service";
import * as _ from "lodash";
import fs from "fs";
import { IHotVideo } from "../models/video-hot/type";

export class ChannelController {
  private channelService: ChannelService = new ChannelService();
  private hotVideoService: HotVideoService = new HotVideoService();
  private hotChannelService: HotChannelService = new HotChannelService();

  async refresh(req, res) {
    let channelList = await this.channelService.filterChannel({});
    channelList = channelList
      .filter((channel) => {
        let rep = channelList.filter((c) => c.id === channel.id).length;
        if (rep === 1) return channel;
        if (rep > 1 && channel.date.split("|").length > 1) return channel;
        else return null;
      })
      .filter((c) => c);
    await this.channelService.deleteChannel({});
    fs.writeFileSync("refresh.txt", JSON.stringify(channelList));
  }

  async getSystemInformation(req, res) {
    let views = (
      await this.hotChannelService.queryHotChannel([
        { $group: { _id: "", views: { $sum: "$views" } } },
        {
          $project: {
            _id: 0,
            views: "$views",
          },
        },
      ])
    )[0].views;
    let subscribers = (
      await this.hotChannelService.queryHotChannel([
        { $group: { _id: "", subscribe: { $sum: "$subscribe" } } },
        {
          $project: {
            _id: 0,
            subscribe: "$subscribe",
          },
        },
      ])
    )[0].subscribe;
    let numberVideos = (
      await this.hotChannelService.queryHotChannel([
        { $group: { _id: "", numberVideos: { $sum: "$numberVideos" } } },
        {
          $project: {
            _id: 0,
            numberVideos: "$numberVideos",
          },
        },
      ])
    )[0].numberVideos;

    let numberChannels = await this.hotChannelService.getTotalHotChannel();

    return res.status(200).json({
      status: "OK",
      msg: "OK",
      data: { views, subscribers, numberVideos, numberChannels },
    });
  }

  async deleteChannel(req, res) {
    if (!req.params.id)
      return res.status(400).json({ status: "FAIL", msg: "Insufficient" });
    this.channelService.deleteChannel({ id: req.params.id });
    const channelData = await this.channelService.filterChannel({});
    return res.status(200).json({ status: "OK", msg: "OK", data: channelData });
  }

  async getAllChannels(req, res) {
    const channels = await this.channelService.filterChannel({});
    return res.status(200).json({ status: "OK", data: channels });
  }

  async getChannelFromDBByLabel(req, res) {
    if (!req.body.label)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });
    const channelData = await this.channelService.filterChannel({
      label: req.body.label,
    });
    return res.status(200).json({ status: "OK", data: channelData });
  }

  async getChannelFromDBById(req, res) {
    if (!req.body.id)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });
    const channelData = await this.channelService.findChannel({
      id: req.body.id,
    });
    return res.status(200).json({ status: "OK", data: channelData });
  }

  async getAllLabel(req, res) {
    let labelList = await (
      await this.channelService.filterChannel({})
    ).map((c) => c.label);
    labelList = [...new Set(labelList)];

    return res.status(200).json({ status: "OK", data: labelList });
  }

  async updateHotChannel(req, res) {
    let channelList = await this.channelService.filterChannel({});
    let channelListSort = channelList.map((c) => {
      let { videoList, subscribe, views, numberVideos, ...channelInfo } = c;
      let gapViews =
        views.split("|").length > 1
          ? +_.nth(views.split("|"), -1) - +_.nth(views.split("|"), -2)
          : 0;
      let viewsHistory = views;
      views = _.nth(views.split("|"), -1);
      let subscribesHistory = subscribe;
      let gapSubscribes =
        subscribe.split("|").length > 1
          ? +_.nth(subscribe.split("|"), -1) - +_.nth(subscribe.split("|"), -2)
          : 0;
      subscribe = _.nth(subscribe.split("|"), -1);
      let gapNumberVideos =
        numberVideos.split("|").length > 1
          ? +_.nth(numberVideos.split("|"), -1) -
            +_.nth(numberVideos.split("|"), -2)
          : 0;
      let numberVideosHistory = numberVideos;
      numberVideos = _.nth(numberVideos.split("|"), -1);

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
    });

    let i = 0;
    console.log(`TOTAL CHANNEL: ${channelListSort.length}`);
    while (i < channelListSort.length) {
      console.log(`${Math.floor((i + 50) / 50)} loop`);

      let channelData = channelListSort.slice(i, i + 50);
      const saveDataPromise = channelData.map((v) =>
        this.hotChannelService.updateHotChannel({ id: v.id }, v)
      );

      console.log(`Previous Loop Update ${i} channels`);
      console.log(`Updating ${i} -> ${i + 50}`);

      await Promise.all(saveDataPromise);
      i += 50;
    }

    console.log(`DONE UPDATE HOT CHANNEL`);

    return res.status(200).json({ status: "OK" });
  }

  async getSortChannel(req, res) {
    if (
      !+req.params.pageNumber ||
      !["gapSubscribes", "subscribe", "views", "gapViews"].includes(
        req.body.type
      )
    )
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let pageNumber = +req.params.pageNumber;
    const totalChannels = await this.hotChannelService.getTotalHotChannel();
    const totalPage =
      totalChannels % 50 !== 0 ? Math.ceil(totalChannels) : totalChannels / 50;
    pageNumber = pageNumber > totalPage ? totalPage : pageNumber;
    let startIndex =
      pageNumber === 0 || pageNumber === 1 ? 0 : (pageNumber - 1) * 50;
    let numberQueryChannel = pageNumber === 0 ? 50 : pageNumber * 50;

    let channelList: IHotVideo[] = (
      await this.hotChannelService.queryHotChannel([
        { $sort: { [req.body.type]: -1 } },
        { $limit: numberQueryChannel },
      ])
    ).slice(startIndex, startIndex + 50);

    return res.status(200).json({
      status: "OK",
      data: {
        channelList,
        totalPage,
        pageNumber,
      },
    });
  }

  async updateHotVideo(req, res) {
    const channelList = await this.channelService.filterChannel({});
    let videoList = channelList
      .map((c) => {
        let { urlChannel, title, videoList } = c;
        return videoList.map((v) => ({
          ...v,
          channelInformation: { urlChannel, title },
        }));
      })
      .reduce((pre, next) => pre.concat(next));

    videoList = videoList.filter((v) => _.nth(v.views.split("|"), -1) != "-1");

    let i = 0;
    console.log(`TOTAL VIDEO SORT: ${videoList.length}`);
    while (i < videoList.length) {
      console.log(`${Math.floor((i + 50) / 50)} loop`);

      let data = videoList.slice(i, i + 100);
      let videoData: IHotVideo[] = data.map((v) => {
        console.log(`${v.channelInformation.title}`);
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

        return {
          ...v,
          likesHistory: v.likes,
          dislikesHistory: v.dislikes,
          commentCountHistory: v.commentCount,
          viewsHistory: v.views,
          views: +_.nth(v.views.split("|"), -1),
          likes: +_.nth(v.likes.split("|"), -1),
          dislikes: +_.nth(v.dislikes.split("|"), -1),
          commentCount: +_.nth(v.commentCount.split("|"), -1),
          gapViews: +gapViews ? gapViews : 0,
          gapLikes: +gapLikes ? gapLikes : 0,
          gapDislikes: gapDislikes ? gapDislikes : 0,
          gapCommentsCount: gapCommentsCount ? gapCommentsCount : 0,
        };
      });

      const saveDataPromise = videoData.map((v) =>
        this.hotVideoService.updateHotVideo({ id: v.id }, v)
      );

      console.log(`Previous Loop Update ${i} videos`);
      console.log(`Updating ${i} -> ${i + 50}`);

      await Promise.all(saveDataPromise);
      i += 50;
    }

    console.log(`DONE UPDATE HOT VIDEO`);
    return res.status(200).json({ status: "OK" });
  }

  async getSortVideos(req, res) {
    if (
      !["views", "likes", "commentCount", "gapViews"].includes(req.body.type) ||
      !+req.params.pageNumber
    )
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let pageNumber = +req.params.pageNumber;
    const totalVideos = await this.hotVideoService.getTotalHotVideo();
    const totalPage =
      totalVideos % 50 !== 0 ? Math.ceil(totalVideos) : totalVideos / 50;
    pageNumber = pageNumber > totalPage ? totalPage : pageNumber;
    let startIndex =
      pageNumber === 0 || pageNumber === 1 ? 0 : (pageNumber - 1) * 50;
    let numberQueryVideo = pageNumber === 0 ? 50 : pageNumber * 50;

    let videoList: IHotVideo[] = (
      await this.hotVideoService.queryHotVideo([
        { $sort: { [req.body.type]: -1 } },
        { $limit: numberQueryVideo },
      ])
    ).slice(startIndex, startIndex + 50);

    return res.status(200).json({
      status: "OK",
      data: {
        videoList,
        totalPage,
        pageNumber,
      },
    });
  }

  async getTotalSortVideos(req, res) {
    const totalVideos = await this.hotVideoService.getTotalHotVideo();
    const totalPage =
      totalVideos % 50 !== 0 ? Math.ceil(totalVideos) : totalVideos / 50;

    return res.status(200).json({
      status: "OK",
      data: {
        totalVideos,
        totalPage: totalPage >= 500 ? 500 : totalPage,
      },
    });
  }

  async getTotalSortChannels(req, res) {
    const totalChannels = await this.hotChannelService.getTotalHotChannel();
    const totalPage =
      totalChannels % 50 !== 0 ? Math.ceil(totalChannels) : totalChannels / 50;

    return res.status(200).json({
      status: "OK",
      data: {
        totalChannels,
        totalPage: totalPage >= 500 ? 500 : totalPage,
      },
    });
  }
}

import { ChannelService } from "../models/channel/service";
import { HotVideoService } from "../models/video-hot/service";
import { HotChannelService } from "../models/channel-hot/service";
import * as _ from "lodash";
import fs from "fs";
import { IHotVideo } from "../models/video-hot/type";
import * as moment from "moment";
import { IHotChannel } from "models/channel-hot/type";
import { queryVideoViewDistribution } from "../utils/common";

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
      await Promise.all(saveDataPromise);
      console.log(`Updating ${i} -> ${i + 50}`);

      i += 50;
    }

    console.log(`DONE UPDATE HOT CHANNEL`);

    return res.status(200).json({ status: "OK" });
  }

  async getSortChannel(req, res) {
    if (
      !+req.params.pageNumber ||
      ![
        "views",
        "subscribe",
        "numberVideos",
        "gapSubscribes",
        "gapViews",
        "gapNumberVideos",
      ].includes(req.body.type)
    )
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let pageNumber = +req.params.pageNumber;
    let skipDocument = (pageNumber - 1) * 50;
    let channelList: IHotVideo[] = await this.hotChannelService.queryHotChannel(
      [
        { $sort: { [req.body.type]: -1 } },
        { $skip: skipDocument },
        { $limit: 50 },
      ]
    );

    return res.status(200).json({
      status: "OK",
      data: {
        channelList,

        pageNumber,
      },
    });
  }

  async updateHotVideo(req, res) {
    let channelList = await this.channelService.filterChannel({});
    let videoList = channelList
      .map((c) => {
        let { videoList, ...channelInformation } = c;
        return videoList.map((v) => ({
          ...v,
          channelInformation,
        }));
      })
      .reduce((pre, next) => pre.concat(next));

    // videoList = videoList.filter(
    //   (v) =>
    //     _.nth(v.views.split("|"), -1) != "-1" || v.views.split("|").length > 1
    // );

    let i = 0;
    console.log(`TOTAL VIDEO SORT: ${videoList.length}`);
    while (i < videoList.length) {
      console.log(`${Math.floor((i + 50) / 50)} loop`);

      let data = videoList.slice(i, i + 100);
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
        };
      });

      const saveDataPromise = videoData.map((v) =>
        this.hotVideoService.updateHotVideo({ id: v.id }, v)
      );

      console.log(`Previous Loop Update ${i} videos`);
      await Promise.all(saveDataPromise);
      console.log(
        "Channel Index:",
        channelList.findIndex(
          (c) => c.id === data[data.length - 1].channelInformation.id
        )
      );
      console.log(`Updating ${i} -> ${i + 50}`);
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

    let skipDocument = (pageNumber - 1) * 50;
    let videoList: IHotVideo[] = await this.hotVideoService.queryHotVideo(
      [
        { $sort: { [req.body.type]: -1 } },
        { $skip: skipDocument },
        { $limit: 50 },
      ],
      { allowDiskUse: true }
    );

    return res.status(200).json({
      status: "OK",
      data: {
        videoList,
        pageNumber,
      },
    });
  }

  async getTotalSortVideos(req, res) {
    const totalVideos = await this.hotVideoService.getTotalHotVideo();
    const totalPage =
      totalVideos % 50 !== 0 ? Math.ceil(totalVideos / 50) : totalVideos / 50;

    return res.status(200).json({
      status: "OK",
      data: {
        totalVideos,
        totalPage: totalPage,
      },
    });
  }

  async getTotalSortChannels(req, res) {
    const totalChannels = await this.hotChannelService.getTotalHotChannel();
    const totalPage =
      totalChannels % 50 !== 0
        ? Math.ceil(totalChannels / 50)
        : totalChannels / 50;

    return res.status(200).json({
      status: "OK",
      data: {
        totalChannels,
        totalPage,
      },
    });
  }

  async getTotalVideoOfChannel(req, res) {
    const totalVideos = (
      await this.hotVideoService.queryHotVideo([
        {
          $match: {
            "channelInformation.id": req.params.id,
          },
        },
        { $group: { _id: null, count: { $sum: 1 } } },
      ])
    )[0].count;

    const totalPage =
      totalVideos % 50 !== 0 ? Math.ceil(totalVideos / 50) : totalVideos / 50;

    return res.status(200).json({
      status: "OK",
      data: {
        totalVideos,
        totalPage,
      },
    });
  }

  async getChannelInformation(req, res) {
    if (!req.params.id)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let channelData = await this.hotChannelService.findHotChannel({
      id: req.params.id,
    });

    if (!channelData)
      return res
        .status(404)
        .json({ status: "FAIL", msg: "Insufficient parameter", data: {} });

    let viewsRank = -1;
    let subscribeRank = -1;
    if (channelData.views > 0) {
      let sortViewsChannel = await this.hotChannelService.queryHotChannel([
        { $sort: { views: -1 } },
      ]);
      viewsRank =
        sortViewsChannel.findIndex((c) => c.id === channelData.id) + 1;
    }
    if (channelData.subscribe > 0) {
      let sortSubscribeChannel = await this.hotChannelService.queryHotChannel([
        { $sort: { subscribe: -1 } },
      ]);
      subscribeRank =
        sortSubscribeChannel.findIndex((c) => c.id === channelData.id) + 1;
    }

    return res.status(200).json({
      status: "OK",
      data: {
        channel: { ...channelData, viewsRank, subscribeRank },
      },
    });
  }

  async getChannelOverview(req, res) {
    if (!req.params.id)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });
    const channelData = await this.hotChannelService.queryHotChannel(
      [
        {
          $setWindowFields: {
            partitionBy: "",
            sortBy: { subscribe: -1 },
            output: {
              rankSubscribe: { $rank: {} },
            },
          },
        },
        {
          $setWindowFields: {
            partitionBy: "",
            sortBy: { views: -1 },
            output: {
              rankVideoViews: { $rank: {} },
            },
          },
        },
        { $match: { id: req.params.id } },
      ],
      { allowDiskUse: true }
    );

    if (channelData.length === 0)
      return res.status(200).json({ status: "OK", data: { isExist: false } });

    let channel: IHotChannel = channelData[0];

    const days =
      (Date.now() - new Date(channel.publishedAt).getTime()) / 86400000;
    const viewsPerDay = Math.trunc(+channel.views / days);
    const subscribePerDay = Math.trunc(+channel.subscribe / days);

    const dataDuration = (
      await this.hotVideoService.queryHotVideo(
        [
          {
            $facet: {
              videos: [
                {
                  $match: {
                    "channelInformation.id": req.params.id,
                  },
                },
                { $group: { _id: null, count: { $sum: 1 } } },
              ],
              totalDuration: [
                {
                  $match: {
                    "channelInformation.id": "UCrmrMEeVpzHfOsc7vqG4xeg",
                  },
                },
                {
                  $group: {
                    _id: "channelInformation.id",
                    totalDuration: { $sum: "$duration" },
                  },
                },
              ],
            },
          },
        ],
        { allowDiskUse: true }
      )
    )[0];

    let totalDuration: number = dataDuration.totalDuration[0].totalDuration;
    let videos: number = dataDuration.videos[0].count;
    const durationPerVideo = Math.trunc(+totalDuration / +videos);
    const uploadPerWeek = (+channel.numberVideos / (days / 7)).toFixed(1);
    const subscribeGrowPer10K = Math.trunc(
      (+channel.subscribe / +channel.views) * 10000
    );

    return res.status(200).json({
      status: "OK",
      data: {
        isExist: true,
        channelOverview: {
          ...channel,
          viewsPerDay,
          subscribePerDay,
          durationPerVideo,
          uploadPerWeek,
          subscribeGrowPer10K,
        },
      },
    });
  }

  async getChannelTags(req, res) {
    if (!req.params.id)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });
    const tagsList = await this.hotVideoService.queryHotVideo(
      [
        {
          $match: { "channelInformation.id": req.params.id },
        },
        {
          $project: {
            tags: { $size: "$tags" },
          },
        },
      ],
      { allowDiskUse: true }
    );
    if (tagsList.length === 0)
      return res.status(200).json({ status: "OK", data: { isExist: false } });

    return res.status(200).json({
      status: "OK",
      data: {
        tagsList,
      },
    });
  }

  async getVideoViewsDistribution(req, res) {
    if (!req.params.id)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    const query = queryVideoViewDistribution({ id: req.params.id });

    const videoViewsDistribution = (
      await this.hotVideoService.queryHotVideo([query], { allowDiskUse: true })
    )[0];

    for (let i in videoViewsDistribution) {
      videoViewsDistribution[i] =
        videoViewsDistribution[i].length === 0
          ? 0
          : videoViewsDistribution[i][0].count;
    }

    return res.status(200).json({
      status: "OK",
      data: {
        videoViewsDistribution,
      },
    });
  }

  async getChannelVideoList(req, res) {
    if (
      !req.params.id ||
      !["oldest", "gapViews", "views", "newest"].includes(req.body.type) ||
      !+req.params.pageNumber
    )
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let pageNumber = +req.params.pageNumber;
    let skipDocument = (pageNumber - 1) * 50;
    let order =
      ["oldest", "newest"].includes(req.body.type) && req.body.type === "newest"
        ? -1
        : 1;
    const videoList = ["oldest", "newest"].includes(req.body.type)
      ? await this.hotVideoService.queryHotVideo(
          [
            {
              $match: { "channelInformation.id": req.params.id },
            },
            { $sort: { publicAt: order } },
            { $skip: skipDocument },
            { $limit: 50 },
          ],
          { allowDiskUse: true }
        )
      : await this.hotVideoService.queryHotVideo(
          [
            {
              $match: { "channelInformation.id": req.params.id },
            },
            { $sort: { [req.body.type]: -1 } },
            { $skip: skipDocument },
            { $limit: 50 },
          ],
          { allowDiskUse: true }
        );

    if (videoList.length === 0)
      return res.status(200).json({ status: "OK", data: { isExist: false } });

    return res.status(200).json({
      status: "OK",
      data: {
        isExist: true,
        videoList,
      },
    });
  }

  async getVideoDeleted(req, res) {
    if (!req.params.id)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    const videoDeleted: IHotVideo[] = await this.hotVideoService.queryHotVideo([
      {
        $match: {
          $and: [
            { "channelInformation.id": req.params.id },
            { views: { $lt: 0 } },
          ],
        },
      },
    ]);

    return res.status(200).json({
      status: "OK",
      data: {
        videoList: videoDeleted,
      },
    });
  }
}

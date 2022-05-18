import {
  queryChannelSubscriberStatistic,
  queryVideoDurationViews,
  queryVideoViewStatistic,
} from "./../utils/common";
import { ChannelService } from "../models/channel/service";
import { HotVideoService } from "../models/video-hot/service";
import { HotChannelService } from "../models/channel-hot/service";
import * as _ from "lodash";
import fs from "fs";
import { IHotVideo } from "../models/video-hot/type";
import * as moment from "moment";
import { IHotChannel } from "models/channel-hot/type";
import {
  detectKeyword,
  queryVideoDurationStatistic,
  queryVideoViewDistribution,
  queryUploadStatistic,
} from "../utils/common";
import { IChannel } from "models/channel/type";

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
    let labelList = (
      await this.hotChannelService.queryHotChannel([
        { $group: { _id: "$label" } },
      ])
    ).map((c) => c._id);

    return res.status(200).json({ status: "OK", data: { labelList } });
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
        averageUpload:
          +numberVideos > 0
            ? (Date.now() - publishedAt.getTime()) / 604800000 / +numberVideos
            : null,
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
    let j = 0;
    let channelData: IChannel[] = [];
    while (j < channelList.length) {
      channelData = channelList.slice(j, j + 50);
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
      console.log(
        `${Math.round(j / 50)} Loop|| TOTAL VIDEO SORT: ${videoList.length}`
      );
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
      j += 50;
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

  async getVideoTagsSort(req, res) {
    const tagsList = await this.hotVideoService.queryHotVideo(
      [
        {
          $unwind: {
            path: "$tags",
          },
        },
        {
          $group: {
            _id: "$tags",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        { $limit: 30 },
      ],
      { allowDiskUse: true }
    );

    return res.status(200).json({
      status: "OK",
      data: {
        tagsList,
      },
    });
  }

  async getVideoByTag(req, res) {
    if (!req.body.tag || !+req.params.pageNumber)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let pageNumber = +req.params.pageNumber;

    let skipDocument = (pageNumber - 1) * 50;
    const videoList = await this.hotVideoService.queryHotVideo(
      [
        { $match: { $expr: { $in: [req.body.tag, "$tags"] } } },
        { $skip: skipDocument },
        { $limit: 50 },
      ],
      { allowDiskUse: true }
    );

    return res.status(200).json({
      status: "OK",
      data: {
        videoList,
      },
    });
  }

  async getTotalVideoByTag(req, res) {
    if (!req.body.tag)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    const totalVideos = (
      await this.hotVideoService.queryHotVideo(
        [
          { $match: { $expr: { $in: [req.body.tag, "$tags"] } } },
          { $group: { _id: null, count: { $sum: 1 } } },
        ],
        { allowDiskUse: true }
      )
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

  async getTotalVideoByKeyword(req, res) {
    if (!req.body.keyword)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    const totalVideos = (
      await this.hotVideoService.queryHotVideo(
        [
          { $match: { $expr: { $in: [req.body.keyword, "$keywords"] } } },
          { $group: { _id: null, count: { $sum: 1 } } },
        ],
        { allowDiskUse: true }
      )
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

  async getVideoByKeyword(req, res) {
    if (!req.body.keyword || !+req.params.pageNumber)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let pageNumber = +req.params.pageNumber;

    let skipDocument = (pageNumber - 1) * 50;
    const videoList = await this.hotVideoService.queryHotVideo(
      [
        { $match: { $expr: { $in: [req.body.keyword, "$keywords"] } } },
        { $skip: skipDocument },
        { $limit: 50 },
      ],
      { allowDiskUse: true }
    );

    return res.status(200).json({
      status: "OK",
      data: {
        videoList,
      },
    });
  }

  async getVideoKeywordsSort(req, res) {
    const keywordList = await this.hotVideoService.queryHotVideo(
      [
        {
          $unwind: {
            path: "$keywords",
          },
        },
        {
          $group: {
            _id: "$keywords",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        { $limit: 30 },
      ],
      { allowDiskUse: true }
    );

    return res.status(200).json({
      status: "OK",
      data: {
        keywordList,
      },
    });
  }

  async getVideoDurationStatistics(req, res) {
    const query = queryVideoDurationStatistic();
    const videoDurationStatistics = (
      await this.hotVideoService.queryHotVideo([query], { allowDiskUse: true })
    )[0];

    let averageVideoViewList: number[] = [];
    let recommendedDuration;
    let averageViewsRecommendedDuration;
    let _videoDurationStatistics = { ...videoDurationStatistics };
    for (let i in videoDurationStatistics) {
      videoDurationStatistics[i].length > 0 &&
        +videoDurationStatistics[i][0].averageViews &&
        averageVideoViewList.push(+videoDurationStatistics[i][0].averageViews);

      videoDurationStatistics[i] =
        videoDurationStatistics[i].length === 0
          ? 0
          : videoDurationStatistics[i][0].count;
    }
    averageViewsRecommendedDuration = averageVideoViewList.sort().reverse()[0];
    for (let i in _videoDurationStatistics) {
      if (
        +_videoDurationStatistics[i][0].averageViews ===
        averageViewsRecommendedDuration
      ) {
        recommendedDuration = i;
        break;
      }
    }

    return res.status(200).json({
      status: "OK",
      data: {
        videoDurationStatistics,
        recommendedDuration,
        averageViewsRecommendedDuration,
      },
    });
  }

  async getVideoViewsStatistic(req, res) {
    const query = queryVideoViewStatistic();
    const videoViews = (
      await this.hotVideoService.queryHotVideo([query], { allowDiskUse: true })
    )[0];

    for (let i in videoViews) {
      videoViews[i] = videoViews[i].length === 0 ? 0 : videoViews[i][0].count;
    }

    return res.status(200).json({
      status: "OK",
      data: {
        videoViews,
      },
    });
  }

  async getViewsAverage(req, res) {
    let averageVideoView = (
      await this.hotVideoService.queryHotVideo(
        [
          { $match: { views: { $gt: 0 } } },
          { $group: { _id: null, average: { $avg: "$views" } } },
        ],
        { allowDiskUse: true }
      )
    )[0].average;

    return res.status(200).json({
      status: "OK",
      data: {
        averageVideoView: Math.trunc(averageVideoView),
      },
    });
  }

  async getVideoSortByDuration(req, res) {
    if (!req.body.duration)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let duration = +req.body.duration;
    let videoList = await this.hotVideoService.queryHotVideo(
      [
        {
          $match: {
            $and: [
              { duration: { $lte: duration + 9 } },
              { duration: { $gte: duration } },
            ],
          },
        },
        { $sort: { views: -1 } },
        { $limit: 50 },
      ],
      { allowDiskUse: true }
    );

    return res.status(200).json({
      status: "OK",
      data: {
        videoList,
      },
    });
  }

  async getVideoByViews(req, res) {
    if (!req.body.viewScope || !Array.isArray(req.body.viewScope))
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let { viewScope } = req.body as { viewScope: number[] };
    let videoList = viewScope[1]
      ? await this.hotVideoService.queryHotVideo(
          [
            {
              $match: {
                $and: [
                  { views: { $lt: viewScope[1] } },
                  { views: { $gte: viewScope[0] } },
                ],
              },
            },
            { $sort: { views: -1 } },
            { $limit: 50 },
          ],
          { allowDiskUse: true }
        )
      : await this.hotVideoService.queryHotVideo(
          [
            {
              $match: {
                $and: [{ views: { $gte: viewScope[0] } }],
              },
            },
            { $sort: { views: -1 } },
            { $limit: 50 },
          ],
          { allowDiskUse: true }
        );

    return res.status(200).json({
      status: "OK",
      data: {
        videoList,
      },
    });
  }

  async getVideoTagsStatistics(req, res) {
    let videoTagsStatistics = await this.hotVideoService.queryHotVideo(
      [
        {
          $addFields: {
            numberTags: { $size: "$tags" },
          },
        },
        {
          $group: {
            _id: "$numberTags",
            count: {
              $sum: 1,
            },
            averageViews: { $avg: "$views" },
          },
        },
      ],
      {
        allowDiskUse: true,
      }
    );

    let averageViewsRecommendedTags = _.max(
      videoTagsStatistics.map((v) => +v.averageViews)
    );
    videoTagsStatistics = videoTagsStatistics.sort((a, b) => +a._id - +b._id);
    let recommendedTags = videoTagsStatistics.find(
      (v) => +v.averageViews === averageViewsRecommendedTags
    )._id;

    videoTagsStatistics = _.chain(videoTagsStatistics)
      .keyBy("_id")
      .mapValues("count")
      .value();

    return res.status(200).json({
      status: "OK",
      data: {
        videoTagsStatistics,
        averageViewsRecommendedTags,
        recommendedTags,
      },
    });
  }

  async getVideoByTagsNumber(req, res) {
    if (!req.body.numberTags)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let { numberTags } = req.body as { numberTags: number };
    let videoList = await this.hotVideoService.queryHotVideo(
      [
        {
          $match: {
            tags: { $size: +numberTags },
          },
        },
        { $sort: { views: -1 } },
        { $limit: 50 },
      ],
      { allowDiskUse: true }
    );

    return res.status(200).json({
      status: "OK",
      data: {
        videoList,
      },
    });
  }

  async getChannelUploadStatistic(req, res) {
    let channelUploadStatistics = (
      await this.hotChannelService.queryHotChannel(queryUploadStatistic, {
        allowDiskUse: true,
      })
    )[0];
    let channelUploadAverage = {};
    for (let i in channelUploadStatistics) {
      channelUploadAverage[i] =
        channelUploadStatistics[i]
          .map((c: any) => +c.totalUpload)
          .reduce((a, b) => a + b, 0) /
        channelUploadStatistics[i]
          .map((c: any) => +c.count)
          .reduce((a, b) => a + b, 0);

      channelUploadStatistics[i] = _.chain(channelUploadStatistics[i])
        .keyBy("_id")
        .mapValues("count")
        .value();
    }

    const channelUploadAverageGap = [2, 4, 6, 8, 10, 11];
    for (let i in channelUploadStatistics) {
      let differences = _.difference(
        channelUploadAverageGap,
        Object.keys(channelUploadStatistics[i]).map((v) => +v)
      );
      differences.map((e) => (channelUploadStatistics[i][e] = 0));
    }

    return res.status(200).json({
      status: "OK",
      data: {
        channelUploadStatistics,
        channelUploadAverage,
      },
    });
  }

  async getChannelByUpload(req, res) {
    if (
      !req.body.subscribersGap ||
      !req.body.uploadGap ||
      !Array.isArray(req.body.uploadGap) ||
      !Array.isArray(req.body.subscribersGap)
    )
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    const { subscribersGap, uploadGap } = req.body as {
      subscribersGap: number[];
      uploadGap: number[];
    };
    const subscribeCondition =
      subscribersGap.length > 1
        ? [
            { subscribe: { $gte: subscribersGap[0] } },
            { subscribe: { $lt: subscribersGap[1] } },
          ]
        : [{ subscribe: { $gt: subscribersGap[0] } }];

    const uploadGapCondition =
      uploadGap.length > 1
        ? [
            { averageUpload: { $gte: uploadGap[0] } },
            { averageUpload: { $lt: uploadGap[1] } },
          ]
        : [{ averageUpload: { $gt: uploadGap[0] } }];

    const channelList = await this.hotChannelService.queryHotChannel([
      {
        $match: {
          $and: [...subscribeCondition, ...uploadGapCondition],
        },
      },
    ]);

    return res.status(200).json({
      status: "OK",
      data: {
        channelList,
      },
    });
  }

  async getChannelSubscriberStatistic(req, res) {
    const query = queryChannelSubscriberStatistic();
    const channelSubscriber = (
      await this.hotChannelService.queryHotChannel([query], {
        allowDiskUse: true,
      })
    )[0];

    for (let i in channelSubscriber) {
      channelSubscriber[i] =
        channelSubscriber[i].length === 0 ? 0 : channelSubscriber[i][0].count;
    }

    return res.status(200).json({
      status: "OK",
      data: {
        channelSubscriber,
      },
    });
  }

  async getSubscriberAverage(req, res) {
    let averageChannelSubscriber = (
      await this.hotChannelService.queryHotChannel(
        [
          { $match: { subscribe: { $gt: 0 } } },
          { $group: { _id: null, average: { $avg: "$subscribe" } } },
        ],
        { allowDiskUse: true }
      )
    )[0].average;

    return res.status(200).json({
      status: "OK",
      data: {
        averageChannelSubscriber: Math.trunc(averageChannelSubscriber),
      },
    });
  }

  async getChannelBySubscriber(req, res) {
    if (!req.body.subscribeScope || !Array.isArray(req.body.subscribeScope))
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient parameter" });

    let { subscribeScope } = req.body as { subscribeScope: number[] };
    let channelList = subscribeScope[1]
      ? await this.hotChannelService.queryHotChannel(
          [
            {
              $match: {
                $and: [
                  { subscribe: { $lt: subscribeScope[1] } },
                  { subscribe: { $gte: subscribeScope[0] } },
                ],
              },
            },
            { $sort: { subscribe: -1 } },
            { $limit: 50 },
          ],
          { allowDiskUse: true }
        )
      : await this.hotChannelService.queryHotChannel(
          [
            {
              $match: {
                $and: [{ subscribe: { $gte: subscribeScope[0] } }],
              },
            },
            { $sort: { subscribe: -1 } },
            { $limit: 50 },
          ],
          { allowDiskUse: true }
        );

    return res.status(200).json({
      status: "OK",
      data: {
        channelList,
      },
    });
  }
}

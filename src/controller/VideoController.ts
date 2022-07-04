import * as _ from "lodash";
import { HotVideoService } from "./../models/video-hot/service";
import { IHotVideo } from "./../models/video-hot/type";
import {
  queryVideoDurationStatistic,
  queryVideoViewStatistic,
} from "./../utils/common";

export class VideoController {
  private hotVideoService: HotVideoService = new HotVideoService();

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

  async getVideoTagsSort(req, res) {
    const tagsList = await this.hotVideoService.queryHotVideo(
      [
        {
          $project: {
            tags: 1,
            numberOfTags: {
              $cond: {
                if: { $isArray: "$tags" },
                then: { $size: "$tags" },
                else: "NA",
              },
            },
            views: 1,
          },
        },
        {
          $match: {
            numberOfTags: { $gt: 0 },
            views: { $gt: 0 },
          },
        },
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

  async getVideoKeywordsSort(req, res) {
    const keywordList = await this.hotVideoService.queryHotVideo(
      [
        {
          $project: {
            keywords: 1,
            numberOfKeywords: {
              $cond: {
                if: { $isArray: "$keywords" },
                then: { $size: "$keywords" },
                else: "NA",
              },
            },
            views: 1,
          },
        },
        {
          $match: {
            numberOfKeywords: { $gt: 0 },
            views: { $gt: 0 },
          },
        },
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
}

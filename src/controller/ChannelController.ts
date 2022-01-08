import { ChannelService } from "../models/channel/service";
import * as _ from "lodash";
import fs from "fs";

export class ChannelController {
  private channelService: ChannelService = new ChannelService();

  async refesh(req, res) {
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
    fs.writeFileSync("refesh.txt", JSON.stringify(channelList));
  }

  async getSystemInformation(req, res) {
    let channelList = await this.channelService.filterChannel({});
    let views = channelList
      .map((channel) => +channel.views)
      .reduce((a, b) => a + b, 0);
    let subscribers = channelList
      .map((channel) => +channel.subscribe)
      .reduce((a, b) => a + b, 0);
    let videos = channelList
      .map((channel) => +channel.numberVideos)
      .reduce((a, b) => a + b, 0);
    let channels = await (await this.channelService.filterChannel({})).length;

    return res.status(200).json({
      status: "OK",
      msg: "OK",
      data: { views, subscribers, videos, channels },
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
        .json({ status: "FAIL", msg: "Insuffient paramester" });
    const channelData = await this.channelService.filterChannel({
      label: req.body.label,
    });
    return res.status(200).json({ status: "OK", data: channelData });
  }

  async getChannelFromDBById(req, res) {
    if (!req.body.id)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insuffient paramester" });
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

  async getHotChannel(req, res) {
    if (!+req.params.page)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insuffient paramester" });

    let channelList = await this.channelService.filterChannel({});
    let channelListSort = channelList
      .map((c) => {
        let { videoList, subscribe, views, numberVideos, ...channelInfo } = c;
        let gapViews = (
          +_.nth(views.split("|"), -1) - +_.nth(views.split("|"), -2)
        ).toString();
        views = _.nth(views.split("|"), -1);
        let gapSubscribes = (
          +_.nth(subscribe.split("|"), -1) - +_.nth(subscribe.split("|"), -2)
        ).toString();
        subscribe = _.nth(subscribe.split("|"), -1);
        let gapNumberVideos = (
          +_.nth(numberVideos.split("|"), -1) -
          +_.nth(numberVideos.split("|"), -2)
        ).toString();
        numberVideos = _.nth(numberVideos.split("|"), -1);

        return {
          ...channelInfo,
          views,
          numberVideos,
          subscribe,
          gapNumberVideos,
          gapSubscribes,
          gapViews,
        };
      })
      .sort((a, b) => +b.views - +a.views);

    let totalPage =
      channelListSort.length % 100 !== 0
        ? Math.ceil(channelListSort.length / 100)
        : channelListSort.length / 100;

    let page = +req.params.page > totalPage ? totalPage : +req.params.page;
    let startIndex = page === 0 || page || 1 ? 0 : (page - 1) * 100;

    return res.status(200).json({
      status: "OK",
      data: {
        channelList: channelListSort.slice(startIndex, startIndex + 100),
        totalPage,
        page,
      },
    });
  }

  async getHotVideo(req, res) {
    if (!+req.params.page)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insuffient paramester" });

    const channelList = await this.channelService.filterChannel({});
    let videoList = channelList
      .map((c) => {
        let { urlChannel, title, videoList } = c;
        return videoList.map((v) => ({
          ...v,
          channelInfor: { urlChannel, title },
        }));
      })
      .reduce((pre, next) => pre.concat(next));

    let videoListSort = videoList.sort((a, b) => +b.views - +a.views);

    let totalPage =
      videoListSort.length % 100 !== 0
        ? Math.ceil(videoListSort.length / 100)
        : videoListSort.length / 100;

    let page = +req.params.page > totalPage ? totalPage : +req.params.page;
    let startIndex = page === 0 || page || 1 ? 0 : (page - 1) * 100;

    return res.status(200).json({
      status: "OK",
      data: {
        videoList: videoListSort.slice(startIndex, startIndex + 100),
        totalPage,
        page,
      },
    });
  }
}

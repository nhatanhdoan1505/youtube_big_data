import { MainService } from "../utils/MainService";
import { ChannelService } from "../models/channel/service";
import { IChannel } from "models/channel/type";

export class ChannelController {
  private mainService: MainService;
  private channelService: ChannelService = new ChannelService();

  constructor(mainService: MainService) {
    this.mainService = mainService;
  }

  async getVideosOfChannel(req, res) {
    const listUrl: string[] = req.body.url
      .split(",")
      .map((url) => url.replace("//", ""))
      .map((url) => url.split("/"))
      .map((url) => url[url.length - 1]);

    const label = req.body.label;
    let channelData = await this.mainService.getChannel(listUrl);
    channelData = channelData.map((c) => {
      return { ...c, label };
    });

    const saveDataPromise = channelData.map((c: IChannel) =>
      this.channelService.createChannel(c)
    );
    await Promise.all(saveDataPromise);

    return res.status(200).json({ status: "OK", data: channelData });
  }

  async scanOldChannelInfor(req, res) {
    const newData: IChannel[] = await this.mainService.scanOldChannelInfor();
    const updateChannelPromise = newData.map((c) =>
      this.channelService.updateChannel({ id: c.id }, c)
    );
    await Promise.all(updateChannelPromise);
    return res.status(200).json({ status: "OK", data: newData });
  }

  async getVideoDataSort(req, res) {
    if (!req.params.id || !req.body.query)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient paramester" });

    const data: IChannel = await this.channelService.findChannel({
      id: req.params.id,
    });
    if (!data) return null;

    const videos = data.videoList;

    let sortData = videos.sort(
      (a, b) => b[`${req.body.query}`] - a[`${req.body.query}`]
    );
    data.videoList = sortData;

    if (!data)
      return res.status(404).json({ status: "FAIL", msg: "Item not found" });

    return res.status(200).json({ status: "OK", data: data });
  }

  async getVideoDataSortReverse(req, res) {
    if (!req.params.id || !req.body.query)
      return res
        .status(400)
        .json({ status: "FAIL", msg: "Insufficient paramester" });

    const data: IChannel = await this.channelService.findChannel({
      id: req.params.id,
    });
    if (!data) return null;

    const videos = data.videoList;

    let sortData = videos.sort(
      (a, b) => a[`${req.body.query}`] - b[`${req.body.query}`]
    );
    data.videoList = sortData;

    if (!data)
      return res.status(404).json({ status: "FAIL", msg: "Item not found" });

    return res.status(200).json({ status: "OK", data: data });
  }
}

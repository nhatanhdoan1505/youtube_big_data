import { MainService } from "../utils/MainService";
import { ChannelService } from "../models/channel/service";
import { IChannel } from "models/channel/type";
import fs from "fs";

export class ChannelController {
  private mainService: MainService;
  private channelService: ChannelService = new ChannelService();

  constructor(mainService: MainService) {
    this.mainService = mainService;
  }

  async test(req, res) {
    const ids = await (
      await this.channelService.filterChannel({})
    ).map((c) => c.id);
    const idEndpoint = ids.map((i) => `&id=${i}`).join("");
    console.log({ idEndpoint });
    let data = await this.mainService.test(idEndpoint);
    return res.status(200).json({ data });
  }

  async getApiKey(req, res) {
    const apiKey = this.mainService.getAllKey();
    return res.status(200).json({
      status: "OK",
      msg: "Get API KEY Successfully",
      data: { apiKey },
    });
  }

  async updateApiKey(req, res) {
    if (!req.body.key)
      return res
        .status(400)
        .json({ status: "FAIL", data: { msg: "Insufficient paramester" } });

    const apiKey = req.body.key.replace(/,/g, "\n") as string;
    fs.writeFileSync("apiKey.txt", apiKey);

    this.mainService.resetApiKey(apiKey.split("\n"));
    return res.status(200).json({
      status: "OK",
      data: { msg: "Successfully", apiKey: apiKey.split("\n") },
    });
  }

  async deleteChannel(req, res) {
    if (!req.params.id)
      return res.status(400).json({ status: "FAIL", msg: "Insufficient" });
    this.channelService.deleteChannel({ id: req.params.id });
    const channelData = await this.channelService.filterChannel({});
    return res
      .status(200)
      .json({ status: "OK", msg: "Delete Successfully", data: channelData });
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

  async getVideosOfChannel(req, res) {
    let existChannel = (await this.channelService.filterChannel({})).map(
      (c) => c.id
    );

    let listUrl = req.body.url.split(",").map((url) => {
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
    let removeRepeatId = new Set(listId);
    listId = [...removeRepeatId];
    listId = listId.filter((u) => !existChannel.some((i) => i === u));

    let listUserName = listUrl
      .filter((url) => !url.includes("channel"))
      .map((url) => url.replace("//", ""))
      .map((url) => url.split("/"))
      .map((url) => url[url.length - 1]);
    let idFromUser = await this.mainService.getChannelId(listUserName);
    listId = [...listId, ...idFromUser];

    if (listUrl.length === 0)
      return res.status(200).json({ status: "OK", data: [] });

    const label = req.body.label;

    console.log(`GET ${listId.length}`);
    let channelData = await this.mainService.getChannel(listId);
    channelData = channelData.map((c) => {
      return { ...c, label };
    });

    console.log(`GET ${channelData.length} complete`);

    fs.writeFileSync("data.txt", JSON.stringify(channelData));

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

import { MainService } from "../utils/MainService";
import { ChannelService } from "../models/channel/service";
import { IChannel } from "models/channel/type";
import fs from "fs";

export class ServiceController {
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
        .json({ status: "FAIL", data: { msg: "Insufficient parameter" } });

    const apiKey = req.body.key.replace(/,/g, "\n") as string;
    fs.writeFileSync("apiKey.txt", apiKey);

    this.mainService.resetApiKey(apiKey.split("\n"));
    return res.status(200).json({
      status: "OK",
      data: { msg: "Successfully", apiKey: apiKey.split("\n") },
    });
  }

  async getChannelInformation(req, res) {
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
      .map((url) => url[url.length - 1])
      .filter((url) => url !== "");

    console.log({ listUserName });
    let idFromUser = await this.mainService.getChannelId(listUserName);
    listId = [...listId, ...idFromUser];
    listId = [...new Set(listId)];

    if (listUrl.length === 0)
      return res.status(200).json({ status: "OK", data: [] });

    const label = req.body.label;

    console.log(`GET ${listId.length} channels`);

    let i = 0;
    let channelData: IChannel[] = [];
    while (i < listId.length) {
      console.log(`${Math.floor((i + 50) / 50)} loop`);

      channelData = await this.mainService.getChannel(listId.slice(i, i + 50));
      channelData = channelData.map((c) => {
        return { ...c, label };
      });
      const saveDataPromise = channelData.map((c: IChannel) =>
        this.channelService.createChannel(c)
      );

      console.log(
        `Previous Loop Get Channel Information of ${
          i === 0 ? "-_-" : listId[i - 1]
        }`
      );
      await Promise.all(saveDataPromise);
      i += 50;
    }

    console.log(`GET ${listId.length} complete`);

    return res.status(200).json({ status: "OK", data: channelData });
  }

  async scanOldChannelInformation(req, res) {
    let data = await this.channelService.filterChannel({});
    let i = 0;
    let newData: IChannel[];

    console.log(`TOTAL ${data.length} channel to update`);
    while (i < data.length) {
      console.log(`Update ${i} -> ${i + 50}`);
      newData = await this.mainService.scanOldChannelInformation(
        data.slice(i, i + 50)
      );
      const updateChannelPromise = newData.map((c) =>
        this.channelService.updateChannel({ id: c.id }, c)
      );

      console.log(`Successfully Update ${i} videos`);
      console.log(`Updating!! ${i} -> ${i + 50}`);

      await Promise.all(updateChannelPromise);
      i += 50;
    }

    console.log("DONE UPDATE CHANNEL INFORMATION");
    return res.status(200).json({ status: "OK" });
  }
}

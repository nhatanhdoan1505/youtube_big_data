import { MainService } from "./utils/MainService";
import { ChannelService } from "./models/channel/service";
import { IChannel, IVideo } from "./models/channel/type";
import { ChannelController } from "./controller/ChannelController";

export class Router {
  private app;
  private channelService: ChannelService = new ChannelService();
  private channelController: ChannelController;

  constructor(app, channelController: ChannelController) {
    this.app = app;
    this.channelController = channelController;
  }

  route() {
    this.app.get("/", async (req, res) => {
      const listUrl: string[] = req.body.url
        .split(",")
        .map((url) => url.replace("//", ""))
        .map((url) => url.split("/"))
        .map((url) => url[url.length - 1]);

      const label = req.body.label;

      const channelData = await this.channelController.getVideosOfChannel(
        listUrl,
        label
      );
      const saveDataPromise = channelData.map((c: IChannel) =>
        this.channelService.createChannel(c)
      );
      await Promise.all(saveDataPromise);
      return res.status(200).json({ status: "OK" });
    });

    this.app.get("/scan", async (req, res) => {
      const newData = await this.channelController.scanOldChannelInfor();
      const updateChannelPromise = newData.map((c) =>
        this.channelService.updateChannel({ id: c.id }, c)
      );
      await Promise.all(updateChannelPromise);
      return res.status(200).json({ status: "OK", data: newData });
    });
  }
}

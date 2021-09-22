import { MainService } from "./utils/MainService";
import { ChannelService } from "./models/channel/service";
import { IChannel } from "./models/channel/type";

export class Router {
  private app;
  private mainService: MainService;
  private channelService: ChannelService = new ChannelService();

  constructor(app, mainService: MainService) {
    this.app = app;
    this.mainService = mainService;
  }

  route() {
    this.app.get("/", async (req, res) => {
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
      return res.status(200).json({ status: "OK" });
    });
  }
}

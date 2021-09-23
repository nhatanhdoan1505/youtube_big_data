import { schedule } from "node-cron";
import { ChannelController } from "./controller/ChannelController";
import { ChannelService } from "./models/channel/service";

export class CronJob {
  private channelController: ChannelController;
  private channelService: ChannelService = new ChannelService();

  constructor(channelController: ChannelController) {
    this.channelController = channelController;
  }

  updateChannelStatistics() {
    return schedule("0 */3 * * *", async () => {
      const newData = await this.channelController.scanOldChannelInfor();
      const updateDataPromise = newData.map((c) =>
        this.channelService.updateChannel({ id: c.id }, c)
      );
      return Promise.all(updateDataPromise);
    });
  }
}

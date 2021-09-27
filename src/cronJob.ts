import { schedule } from "node-cron";
import { MainService } from "./utils/MainService";
import { ChannelService } from "./models/channel/service";

export class CronJob {
  private channelService: ChannelService = new ChannelService();
  private mainService: MainService;

  constructor(mainService: MainService) {
    this.mainService = mainService;
  }

  updateChannelStatistics() {
    return schedule("0 */3 * * *", async () => {
      const newData = await this.mainService.scanOldChannelInfor();
      const updateDataPromise = newData.map((c) =>
        this.channelService.updateChannel({ id: c.id }, c)
      );
      return Promise.all(updateDataPromise);
    });
  }
}

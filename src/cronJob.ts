import { schedule } from "node-cron";
import { Server } from "socket.io";
import { YoutubeHandler } from "./handler/YoutubeHandler";

export class CronJob {
  private youtubeHandler: YoutubeHandler;
  private io: Server;
  constructor(io: Server) {
    this.io = io;
    this.youtubeHandler = new YoutubeHandler(io);
  }

  async firstUpdate() {
    console.log("UPDATE");
    await this.youtubeHandler.updateChannelInformation({
      label: undefined,
    });
    await this.youtubeHandler.updateHotChannel({ label: undefined });
    await this.youtubeHandler.updateHotChannel({ label: undefined });
  }

  updateDB() {
    return schedule("0 */12 * * *", async () => {
      await this.youtubeHandler.updateChannelInformation({
        label: undefined,
      });
      await this.youtubeHandler.updateHotChannel({ label: undefined });
      await this.youtubeHandler.updateHotChannel({ label: undefined });
    });
  }
}

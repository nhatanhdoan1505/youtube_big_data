import { YoutubeHandler } from "./../handler/YoutubeHandler";
import { Server, Socket } from "socket.io";
import { EVENT } from "../module/common";
export class Listener {
  private io: Server;
  private youtubeHandler: YoutubeHandler;

  constructor(io: Server) {
    this.io = io;
    this.youtubeHandler = new YoutubeHandler(io);
  }

  listen(socket: Socket) {
    socket.on("disconnect", async () => {
      // console.log(`$${socket.id} disconnected`);
    });

    socket.on(
      EVENT.GET_NEW_CHANNEL,
      async ({ url, label }: { url: string; label: string }) => {
        if (!url || !label) return;

        await this.youtubeHandler.getNewChannel({ url, label });

        return;
      }
    );

    socket.on(
      EVENT.UPDATE_CHANNEL,
      async ({ label }: { label: string | null }) => {
        if (!label) return;

        await this.youtubeHandler.updateChannelInformation({ label });

        return;
      }
    );

    socket.on(EVENT.OPTIMIZE, async ({ label }: { label: string | null }) => {
      await this.youtubeHandler.updateHotChannel({ label });
      
      await this.youtubeHandler.updateHotVideo({ label });

      return;
    });

    socket.on(EVENT.SERVER_READY, () => {
      return this.youtubeHandler.getServerStatus({ socket });
    });
  }
}

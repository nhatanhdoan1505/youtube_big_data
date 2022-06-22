import { Server, Socket } from "socket.io";
import { EVENT } from "./common";

export class Emitter {
  private io: Server;
  constructor(io: Server) {
    this.io = io;
  }

  serverStatus = ({
    ready,
    serviceRunning,
    total,
    numberWorked,
  }: {
    ready?: boolean;
    serviceRunning?: "UPDATE" | "GET" | "OPTIMIZE";
    total?: number;
    numberWorked?: number;
  }) => {
    return this.io.sockets.emit(EVENT.SERVER_READY, {
      data: { ready, serviceRunning, total, numberWorked },
    });
  };
}

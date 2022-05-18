import { Server, Socket } from "socket.io";
export class Listener {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  listen(socket: Socket) {
    socket.on("disconnect", async () => {
      console.log(`$${socket.id} disconnected`);
    });
  }

  
}

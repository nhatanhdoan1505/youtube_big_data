import { CronJob } from "./cronJob";
import * as bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { Listener } from "./module/listener";
import { connectMongo } from "./mongo";
import { Router } from "./router";
import path = require("path");
import dotenv = require("dotenv");

dotenv.config();

const main = async () => {
  const app = express();

  const router = new Router(app);

  await connectMongo();

  app.use(express.static(path.join(__dirname)));
  app.use("/webhook", express.raw({ type: "*/*" }));
  app.use(express.json());
  app.use(cors({ credentials: true, origin: true }));
  app.use(bodyParser.urlencoded({ extended: false }));

  router.route();

  const port = process.env.PORT || 8080;
  const server = http.createServer(app);
  server.listen(port, () => console.log(`Server is listening at port ${port}`));
  const io = new Server(server, {
    cookie: false,
    allowEIO3: true,
    serveClient: false,
    cors: {
      origin: "*",
    },
  });

  const listener = new Listener(io);
  const cronJob = new CronJob(io);
  // cronJob.updateDB();
  // cronJob.firstUpdate();
  io.on("connection", (socket: Socket) => {
    socket.emit("connection");

    listener.listen(socket);
  });
};

main();

// 45.77.119.159:root:2]Loq)pU2CM]]VKQ

import express from "express";
import path = require("path");
import cors from "cors";
import * as bodyParser from "body-parser";
import { YoutubeService } from "./utils/YoutubeService";
import { MainService } from "./utils/MainService";
import { Router } from "./router";
import { connectMongo } from "./mongo";
import dotenv = require("dotenv");
import { ServiceController } from "./controller/ServiceController";
import { UserController } from "./controller/UserController";
import { CronJob } from "./cronJob";
import fs from "fs";
import { ChannelController } from "./controller/ChannelController";
import { Server, Socket } from "socket.io";
import http from "http";
import { Listener } from "./module/listener";

dotenv.config();

const main = async () => {
  const app = express();

  const apiKey = fs.readFileSync("apiKey.txt", { encoding: "utf-8" });
  const youtubeService = new YoutubeService(apiKey.split(/\n/));
  const mainService = new MainService(youtubeService);
  const serviceController = new ServiceController(mainService);
  const userController = new UserController();
  const channelController = new ChannelController();

  const router = new Router(
    app,
    serviceController,
    userController,
    channelController
  );

  await connectMongo();

  app.use(express.static(path.join(__dirname)));
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  router.route();

  // const cronJob = new CronJob(mainService);
  // cronJob.updateChannelStatistics();

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
  io.on("connection", (socket: Socket) => {
    console.log(`${socket.id} connected`);
    listener.listen(socket);
  });
};

main();

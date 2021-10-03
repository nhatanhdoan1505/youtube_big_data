import express from "express";
import path = require("path");
import cors from "cors";
import * as bodyParser from "body-parser";
import { ClawlService } from "./utils/ClawlService";
import { YoutubeService } from "./utils/YoutubeSevice";
import { MainService } from "./utils/MainService";
import { Router } from "./router";
import { connectMongo } from "./mongo";
import dotenv = require("dotenv");
import { ChannelController } from "./controller/ChannelController";
import { UserController } from "./controller/UserController";
import { CronJob } from "./cronJob";

dotenv.config();

const main = async () => {
  const app = express();

  const youtubeService = new YoutubeService(process.env.API_KEY.split(","));
  const mainService = new MainService(youtubeService);
  const channelController = new ChannelController(mainService);
  const userController = new UserController();

  const router = new Router(app, channelController, userController);

  await connectMongo();

  app.use(express.static(path.join(__dirname)));
  app.use(cors("*"));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  router.route();

  const cronJob = new CronJob(mainService);
  cronJob.updateChannelStatistics();
  cronJob.resetApiKey();

  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Server is listenning at port ${port}`));
};

main();

import express from "express";
import path = require("path");
import cors from "cors";
import * as bodyParser from "body-parser";
import { ClawlService } from "./utils/ClawlService";
import { YoutubeService } from "./utils/YoutubeSevice";
import { MainService } from "./utils/MainService";
import fs from "fs";
import dotenv = require("dotenv");
dotenv.config();

const main = () => {
  const clawlService = new ClawlService();
  const youtubeService = new YoutubeService(
    process.env.API_KEY.split(","),
    clawlService
  );
  const mainService = new MainService(clawlService, youtubeService);

  const app = express();

  app.use(express.static(path.join(__dirname)));
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get("/", async (req, res) => {
    const listUrl: string[] = req.body.url
      .split(",")
      .map((url) => url.replace("//", ""))
      .map((url) => url.split("/"))
      .map((url) => url[url.length - 1]);

    const channelData = await mainService.getChannel(listUrl);
    return res.status(200).json({ status: "OK" });
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => console.log(`Server is listenning at port ${port}`));
};

main();

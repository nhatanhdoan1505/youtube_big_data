import { MainService } from "./utils/MainService";
import { ChannelService } from "./models/channel/service";
import { ChannelController } from "./controller/ChannelController";
import { UserController } from "controller/UserController";

export class Router {
  private app;
  private channelController: ChannelController;
  private userController: UserController;

  constructor(
    app,
    channelController: ChannelController,
    userController: UserController
  ) {
    this.app = app;
    this.channelController = channelController;
    this.userController = userController;
  }

  route() {
    this.app.post("api/auth/sign_up", (req, res) => {
      return this.userController.siginUp(req, res);
    });

    this.app.post("api/auth/verifyCode", (req, res) => {
      return this.userController.verifiedCode(req, res);
    });

    this.app.post("api/auth/sign_in", (req, res) => {
      return this.userController.signIn(req, res);
    });

    this.app.get("api/service/getChannel", (req, res) => {
      return this.channelController.getVideosOfChannel(req, res);
    });

    this.app.get("api/service/scan", (req, res) => {
      return this.channelController.scanOldChannelInfor(req, res);
    });

    this.app.get("api/service/sort/:id", (req, res) => {
      return this.channelController.getVideoDataSort(req, res);
    });

    this.app.get("api/service/sort/:id/reverse", (req, res) => {
      return this.channelController.getVideoDataSortReverse(req, res);
    });
  }
}

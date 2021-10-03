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
    this.app.post("/api/auth/sign_up", (req, res) => {
      return this.userController.siginUp(req, res);
    });

    this.app.post("/api/auth/verifyCode", (req, res) => {
      return this.userController.verifiedCode(req, res);
    });

    this.app.post("/api/auth/sign_in", (req, res) => {
      return this.userController.signIn(req, res);
    });

    this.app.post("/api/auth/isAdmin", (req, res) => {
      return this.userController.isAdmin(req, res);
    });

    this.app.post("/api/service/getChannel", (req, res) => {
      return this.channelController.getVideosOfChannel(req, res);
    });

    this.app.post("/api/service/scan", (req, res) => {
      return this.channelController.scanOldChannelInfor(req, res);
    });

    this.app.post("/api/channel/sort/:id", (req, res) => {
      return this.channelController.getVideoDataSort(req, res);
    });

    this.app.post("/api/channel/sort/:id/reverse", (req, res) => {
      return this.channelController.getVideoDataSortReverse(req, res);
    });

    this.app.get("/api/channels", (req, res) => {
      return this.channelController.getAllChannels(req, res);
    });

    this.app.post("/api/channel/label", (req, res) => {
      return this.channelController.getChannelFromDBByLabel(req, res);
    });

    this.app.post("/api/channel/id", (req, res) => {
      return this.channelController.getChannelFromDBById(req, res);
    });

    this.app.delete("/api/channel/:id", (req, res) => {
      return this.channelController.deleteChannel(req, res);
    });
  }
}

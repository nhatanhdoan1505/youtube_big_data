import { ServiceController } from "./controller/ServiceController";
import { UserController } from "./controller/UserController";
import { ChannelController } from "./controller/ChannelController";

export class Router {
  private app;
  private serviceController: ServiceController;
  private userController: UserController;
  private channelController: ChannelController;

  constructor(
    app,
    serviceController: ServiceController,
    userController: UserController,
    channelController: ChannelController
  ) {
    this.app = app;
    this.serviceController = serviceController;
    this.userController = userController;
    this.channelController = channelController;
  }

  route() {
    this.app.post("/api/refesh", (req, res) => {
      return this.channelController.refesh(req, res);
    });

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
      return this.serviceController.getVideosOfChannel(req, res);
    });

    this.app.post("/api/service/scan", (req, res) => {
      return this.serviceController.scanOldChannelInfor(req, res);
    });

    this.app.post("/api/channel/sort/:id", (req, res) => {
      return this.serviceController.getVideoDataSort(req, res);
    });

    this.app.post("/api/channel/sort/:id/reverse", (req, res) => {
      return this.serviceController.getVideoDataSortReverse(req, res);
    });

    this.app.get("/api/service/key", (req, res) => {
      return this.serviceController.getApiKey(req, res);
    });

    this.app.put("/api/service/key", (req, res) => {
      return this.serviceController.updateApiKey(req, res);
    });

    this.app.get("/test", (req, res) => {
      return this.serviceController.test(req, res);
    });

    this.app.get("/api/channels", (req, res) => {
      return this.channelController.getAllChannels(req, res);
    });

    this.app.post("/api/channel/label", (req, res) => {
      return this.channelController.getChannelFromDBByLabel(req, res);
    });

    this.app.get("/api/channel/system", (req, res) => {
      return this.channelController.getSystemInformation(req, res);
    });

    this.app.post("/api/channel/id", (req, res) => {
      return this.channelController.getChannelFromDBById(req, res);
    });

    this.app.delete("/api/channel/:id", (req, res) => {
      return this.channelController.deleteChannel(req, res);
    });

    this.app.get("/api/channel/label/", (req, res) => {
      return this.channelController.getAllLabel(req, res);
    });

    this.app.get("/api/channel/hot/:page", (req, res) => {
      return this.channelController.getHotChannel(req, res);
    });

    this.app.get("/api/video/hot/:page", (req, res) => {
      return this.channelController.getHotVideo(req, res);
    });
  }
}

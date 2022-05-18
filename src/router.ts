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
    this.app.post("/api/refresh", (req, res) => {
      return this.channelController.refresh(req, res);
    });

    this.app.post("/api/auth/sign_up", (req, res) => {
      return this.userController.signUp(req, res);
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
      return this.serviceController.getChannelInformation(req, res);
    });

    this.app.post("/api/service/scan", (req, res) => {
      return this.serviceController.scanOldChannelInformation(req, res);
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

    this.app.get("/api/system", (req, res) => {
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

    this.app.post("/api/video/hot", (req, res) => {
      return this.channelController.updateHotVideo(req, res);
    });

    this.app.post("/api/channel/hot", (req, res) => {
      return this.channelController.updateHotChannel(req, res);
    });

    this.app.post("/api/channel/sort/:pageNumber", (req, res) => {
      return this.channelController.getSortChannel(req, res);
    });

    this.app.post("/api/video/sort/:pageNumber", (req, res) => {
      return this.channelController.getSortVideos(req, res);
    });

    this.app.get("/api/video/sort/total", (req, res) => {
      return this.channelController.getTotalSortVideos(req, res);
    });

    this.app.get("/api/channel/sort/total", (req, res) => {
      return this.channelController.getTotalSortChannels(req, res);
    });

    this.app.get("/api/channel/videos/total/:id", (req, res) => {
      return this.channelController.getTotalVideoOfChannel(req, res);
    });

    this.app.get("/api/channel/overview/:id", (req, res) => {
      return this.channelController.getChannelOverview(req, res);
    });

    this.app.get("/api/channel/tagsList/:id", (req, res) => {
      return this.channelController.getChannelTags(req, res);
    });

    this.app.post("/api/channel/videoList/:id/:pageNumber", (req, res) => {
      return this.channelController.getChannelVideoList(req, res);
    });

    this.app.get("/api/channel/videoViewsDistribution/:id", (req, res) => {
      return this.channelController.getVideoViewsDistribution(req, res);
    });

    this.app.get("/api/channel/videoDeleted/:id", (req, res) => {
      return this.channelController.getVideoDeleted(req, res);
    });

    this.app.get("/api/videoTags/sort", (req, res) => {
      return this.channelController.getVideoTagsSort(req, res);
    });

    this.app.post("/api/video/hashtag/total", (req, res) => {
      return this.channelController.getTotalVideoByTag(req, res);
    });

    this.app.post("/api/video/hashtag/:pageNumber", (req, res) => {
      return this.channelController.getVideoByTag(req, res);
    });

    this.app.get("/api/videoKeyword/sort", (req, res) => {
      return this.channelController.getVideoKeywordsSort(req, res);
    });

    this.app.post("/api/video/keyword/total", (req, res) => {
      return this.channelController.getTotalVideoByKeyword(req, res);
    });

    this.app.post("/api/video/keyword/:pageNumber", (req, res) => {
      return this.channelController.getVideoByKeyword(req, res);
    });

    this.app.get("/api/video/duration/statistic", (req, res) => {
      return this.channelController.getVideoDurationStatistics(req, res);
    });

    this.app.post("/api/video/duration/sort", (req, res) => {
      return this.channelController.getVideoSortByDuration(req, res);
    });

    this.app.get("/api/video/views/statistic", (req, res) => {
      return this.channelController.getVideoViewsStatistic(req, res);
    });

    this.app.post("/api/video/views/sort", (req, res) => {
      return this.channelController.getVideoByViews(req, res);
    });

    this.app.get("/api/video/averageViews", (req, res) => {
      return this.channelController.getViewsAverage(req, res);
    });

    this.app.get("/api/video/tags/statistic", (req, res) => {
      return this.channelController.getVideoTagsStatistics(req, res);
    });

    this.app.post("/api/video/numberTags/sort", (req, res) => {
      return this.channelController.getVideoByTagsNumber(req, res);
    });

    this.app.get("/api/channel/upload/statistic", (req, res) => {
      return this.channelController.getChannelUploadStatistic(req, res);
    });

    this.app.post("/api/channel/upload/sort", (req, res) => {
      return this.channelController.getChannelByUpload(req, res);
    });

    this.app.get("/api/channel/subscriber/statistic", (req, res) => {
      return this.channelController.getChannelSubscriberStatistic(req, res);
    });

    this.app.get("/api/channel/averageSubscriber", (req, res) => {
      return this.channelController.getSubscriberAverage(req, res);
    });

    this.app.post("/api/channel/subscriber/sort", (req, res) => {
      return this.channelController.getChannelBySubscriber(req, res);
    });
  }
}

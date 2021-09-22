import axios from "axios";
import { VideoInfor, VideoJson } from "../type";

export class ClawlService {
  async getVideoInfor({
    id,
    title,
    publicAt,
    thumbnail,
  }: {
    id: string;
    title: string;
    publicAt: string;
    thumbnail: string;
  }): Promise<VideoInfor> {
    try {
      let html = await axios.get(`https://www.youtube.com/watch?v=${id}`);
      let content: VideoJson = html.data;
      let respone: VideoJson = this.getJsonVideo(content.toString());

      const likeDislikeText =
        respone.contents.twoColumnWatchNextResults.results.results.contents[0]
          .videoPrimaryInfoRenderer.sentimentBar.sentimentBarRenderer.tooltip;
      const viewText =
        respone.contents.twoColumnWatchNextResults.results.results.contents[0]
          .videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer.viewCount
          .simpleText;

      console.log({ viewText, likeDislikeText });
      console.log({
        views: +viewText.split(" ")[0].replace(/\./g, ""),
        likes: +likeDislikeText.split("/")[0].replace(/\./g, ""),
        dislikes: +likeDislikeText.split("/")[0].replace(/\./g, ""),
        id: id,
        title,
        publicAt,
        thumbnail,
      });

      let days =
        Math.abs(new Date().getTime() - new Date(publicAt).getTime()) / 3600000;
      return {
        views: +viewText.split(" ")[0].replace(/\./g, ""),
        likes: +likeDislikeText.split("/")[0].replace(/\./g, ""),
        dislikes: +likeDislikeText.split("/")[0].replace(/\./g, ""),
        id: id,
        title,
        publicAt,
        thumbnail,
        days,
      };
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  }

  getJsonVideo(html: string): VideoJson {
    let htmlCut = html.slice(html.indexOf("var ytInitialData"));
    htmlCut = htmlCut.slice(
      "var ytInitialData = ".length,
      htmlCut.indexOf(";</script")
    );
    let videoObject = JSON.parse(htmlCut);
    return videoObject;
  }
}

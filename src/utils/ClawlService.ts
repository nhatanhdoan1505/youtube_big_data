import axios from "axios";
import fs from "fs";
import { VideoInfor, VideoJson } from "../type";

export class ClawlService {
  cookie = `VISITOR_INFO1_LIVE=m9wrWraUdh4; PREF=tz=Asia.Saigon&f5=20000&f4=4000000; LOGIN_INFO=AFmmF2swRgIhAIu88eUBg_Wd9_NW8RnEXOBX0uIaPmzJPDebXLVAxnQEAiEA-fHojMgGzn0HT1pPBYo_Th7oiqDZyieYuB12akimEyY:QUQ3MjNmeXItaG1TdVR3a2NNSE5zc3FNVXhHYW4wQ0FDX200b293YTVPakd4R0JnMXJ5Zmdoc0hCb3U1X1NLQl8tRlpZa1hnMXR1Q1pDOEtmQUpkOHJtVlphSDRPaEFUVW9odGJZN1FyOUV1V3lpak5KQks4RkZudlpMUFY0ZGpVS1BiZTRZaVdXX3cyU3NSdThIWWJ0OXk5ZVQzZ00zNzNB; SID=CAiN5MfaPrjH6nDz4J1kH4Of645JR2El4gRz-d0aEhpiC9jRrPB8wFsKylwh0Xei3ePR0g.; __Secure-1PSID=CAiN5MfaPrjH6nDz4J1kH4Of645JR2El4gRz-d0aEhpiC9jRCJnX0SnXOTSLLmwA3ukhiw.; __Secure-3PSID=CAiN5MfaPrjH6nDz4J1kH4Of645JR2El4gRz-d0aEhpiC9jRO3sPVKpzL0Rex1K-73ymcw.; HSID=AF3Ud0CpzcETYQrJt; SSID=Awk4uGD-E_2kyJie8; APISID=RABk-YfRZrvDxIGr/Aur2709X_bwE1Rj6r; SAPISID=GOVneMThbmbBN9EV/AfVR-F8QgxDv2tmlE; __Secure-1PAPISID=GOVneMThbmbBN9EV/AfVR-F8QgxDv2tmlE; __Secure-3PAPISID=GOVneMThbmbBN9EV/AfVR-F8QgxDv2tmlE; YSC=Eg6H9iJiJCI; SIDCC=AJi4QfHcsOB8LjM1GjpX45OJrGgHiCDzzFYkrhdtrGBBuP-PrCUbI9YJEhGZwQ82iimbmcw0Ig; __Secure-3PSIDCC=AJi4QfHOG1qvyVt5tUDyWnF4DcRP_Yk-8zdxx34iQe_tK-9jjafFfrg-lwgnjCxQd_mNE48rpk5e; ST-1h8zsq0=itct=CIwDENwwIhMIzr7Np_qU8wIVvMhzAR3dHA3lMgpnLWhpZ2gtcmVjWg9GRXdoYXRfdG9fd2F0Y2iaAQYQjh4YngE=&csn=MC43MTQwMTYyNDExODQ2MzM2&endpoint={"clickTrackingParams":"CIwDENwwIhMIzr7Np_qU8wIVvMhzAR3dHA3lMgpnLWhpZ2gtcmVjWg9GRXdoYXRfdG9fd2F0Y2iaAQYQjh4YngE=","commandMetadata":{"webCommandMetadata":{"url":"/watch?v=J-389EEj5cU","webPageType":"WEB_PAGE_TYPE_WATCH","rootVe":3832}},"watchEndpoint":{"videoId":"J-389EEj5cU","watchEndpointSupportedOnesieConfig":{"html5PlaybackOnesieConfig":{"commonConfig":{"url":"https://r1---sn-8pxuuxa-q5qee.googlevideo.com/initplayback?source=youtube&orc=1&oeis=1&c=WEB&oad=3200&ovd=3200&oaad=11000&oavd=11000&ocs=700&oewis=1&oputc=1&ofpcc=1&msp=1&odeak=1&odepv=1&osfc=1&ip=116.98.162.219&id=27edfcf44123e5c5&initcwndbps=2001250&mt=1632394866&oweuc=&pxtags=Cg4KAnR4EggyMzk5Nzk3MA&rxtags=Cg4KAnR4EggyMzk5Nzk3MA%2CCg4KAnR4EggyNDAwODEwOA"}}}}}`;
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
      let html = await axios.get(`https://www.youtube.com/watch?v=${id}`, {
        headers: { cookie: this.cookie },
      });

      let content: VideoJson = html.data;
      let respone: VideoJson = this.getJsonVideo(content.toString());

      const likeDislikeText = respone.contents.twoColumnWatchNextResults.results
        .results.contents[0].videoPrimaryInfoRenderer
        ? respone.contents.twoColumnWatchNextResults.results.results.contents[0]
            .videoPrimaryInfoRenderer.sentimentBar.sentimentBarRenderer.tooltip
        : respone.contents.twoColumnWatchNextResults.results.results.contents[1]
            .videoPrimaryInfoRenderer.sentimentBar.sentimentBarRenderer.tooltip;
      const viewText = respone.contents.twoColumnWatchNextResults.results
        .results.contents[0].videoPrimaryInfoRenderer
        ? respone.contents.twoColumnWatchNextResults.results.results.contents[0]
            .videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer.viewCount
            .simpleText
        : respone.contents.twoColumnWatchNextResults.results.results.contents[1]
            .videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer.viewCount
            .simpleText;
      if (title === "Số ca mắc, tử vong do COVID-19 liên tục giảm | VTV24") {
        console.log({ likeDislikeText, viewText });
      }
      const views =
        viewText.indexOf(",") !== -1
          ? +viewText.split(" ")[0].replace(/\,/g, "")
          : +viewText.split(" ")[0].replace(/\./g, "");
      const likes =
        viewText.indexOf(",") !== -1
          ? +likeDislikeText.split("/")[0].replace(/\,/g, "")
          : +likeDislikeText.split("/")[0].replace(/\./g, "");
      const dislikes =
        viewText.indexOf(",") !== -1
          ? +likeDislikeText.split("/")[1].replace(/\,/g, "")
          : +likeDislikeText.split("/")[1].replace(/\./g, "");

      let days = Math.floor(
        Math.abs(new Date().getTime() - new Date(publicAt).getTime()) / 3600000
      );
      // const data = { likeDislikeText, viewText, views, likes, dislikes, days };
      // console.log({
      //   title,
      // });
      return {
        views,
        likes,
        dislikes,
        id,
        title,
        publicAt,
        thumbnail,
        days,
      };
    } catch (error) {
      if (error.response) {
        console.log(error.response.statusText);
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

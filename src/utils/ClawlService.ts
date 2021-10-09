// import axios from "axios";
// import fs from "fs";
// import { VideoInfor, VideoJson } from "../type";

// export class ClawlService {
//   cookie = `VISITOR_INFO1_LIVE=m9wrWraUdh4; PREF=tz=Asia.Saigon&f5=20000&f4=4000000; LOGIN_INFO=AFmmF2swRgIhAIu88eUBg_Wd9_NW8RnEXOBX0uIaPmzJPDebXLVAxnQEAiEA-fHojMgGzn0HT1pPBYo_Th7oiqDZyieYuB12akimEyY:QUQ3MjNmeXItaG1TdVR3a2NNSE5zc3FNVXhHYW4wQ0FDX200b293YTVPakd4R0JnMXJ5Zmdoc0hCb3U1X1NLQl8tRlpZa1hnMXR1Q1pDOEtmQUpkOHJtVlphSDRPaEFUVW9odGJZN1FyOUV1V3lpak5KQks4RkZudlpMUFY0ZGpVS1BiZTRZaVdXX3cyU3NSdThIWWJ0OXk5ZVQzZ00zNzNB; SID=CAiN5OJBJ6Sd6bwR_O73HgKd6ZFE_B_qvPk0sRBgyjEglRqU-OLQCnRZpn_QU70FKiVdbw.; __Secure-1PSID=CAiN5OJBJ6Sd6bwR_O73HgKd6ZFE_B_qvPk0sRBgyjEglRqULsdW5gUF-y5rAtMcGCnMog.; __Secure-3PSID=CAiN5OJBJ6Sd6bwR_O73HgKd6ZFE_B_qvPk0sRBgyjEglRqUECFg9uIsQBb1EvW9ztGA2g.; HSID=AzEoqY06BpR_nfQko; SSID=Afx85GuEqiyZr_UW1; APISID=48n8VdAQFtb23R1X/AzSbWOy_Y8EHr4Qj9; SAPISID=uZbElZNLUwtPGQOf/ASiITSp68Fs3L_Hxv; __Secure-1PAPISID=uZbElZNLUwtPGQOf/ASiITSp68Fs3L_Hxv; __Secure-3PAPISID=uZbElZNLUwtPGQOf/ASiITSp68Fs3L_Hxv; YSC=nW5yHezzhfc; SIDCC=AJi4QfGrEKZbDhtE7sIh2EkNCeA9Xb8XJoKqlcptWNM-BCOG0hcRENDDbuiMwyFp0sqG6KcQfA; __Secure-3PSIDCC=AJi4QfF7OuRfDRLisUL_dO8800i_t81jIu0loITY4MzlAnKOgxSmdNCLsTciPH6dPuTjznzDyg; ST-3piiyh=itct=CDAQ8JMBGAEiEwjdv5HWyZ7zAhURMSoKHRV5ACQ=&csn=MC44ODk2MTYwMjY5MTU5MTE5&endpoint={"clickTrackingParams":"CDAQ8JMBGAEiEwjdv5HWyZ7zAhURMSoKHRV5ACQ=","commandMetadata":{"webCommandMetadata":{"url":"/c/KeBeNghe/videos","webPageType":"WEB_PAGE_TYPE_CHANNEL","rootVe":3611,"apiUrl":"/youtubei/v1/browse"}},"browseEndpoint":{"browseId":"UCWEJj_EHNoBZkxHX8iqrf-Q","params":"EgZ2aWRlb3M%3D","canonicalBaseUrl":"/c/KeBeNghe"}}`;
//   async getVideoInfor({
//     id,
//     title,
//     publicAt,
//     thumbnail,
//     date,
//   }: {
//     id: string;
//     title: string;
//     publicAt: string;
//     thumbnail: string;
//     date: string;
//   }): Promise<VideoInfor> {
//     try {
//       let html = await axios.get(`https://www.youtube.com/watch?v=${id}`, {
//         headers: { cookie: this.cookie },
//       });

//       let content: VideoJson = html.data;
//       let respone: VideoJson = this.getJsonVideo(content.toString());

//       const likeDislikeText = respone.contents.twoColumnWatchNextResults.results
//         .results.contents[0].videoPrimaryInfoRenderer
//         ? respone.contents.twoColumnWatchNextResults.results.results.contents[0]
//             .videoPrimaryInfoRenderer.sentimentBar.sentimentBarRenderer.tooltip
//         : respone.contents.twoColumnWatchNextResults.results.results.contents[1]
//             .videoPrimaryInfoRenderer.sentimentBar.sentimentBarRenderer.tooltip;
//       const viewText = respone.contents.twoColumnWatchNextResults.results
//         .results.contents[0].videoPrimaryInfoRenderer
//         ? respone.contents.twoColumnWatchNextResults.results.results.contents[0]
//             .videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer.viewCount
//             .simpleText
//         : respone.contents.twoColumnWatchNextResults.results.results.contents[1]
//             .videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer.viewCount
//             .simpleText;
     
//       const views =
//         viewText.indexOf(",") !== -1
//           ? viewText.split(" ")[0].replace(/\,/g, "")
//           : viewText.split(" ")[0].replace(/\./g, "");
//       const likes =
//         viewText.indexOf(",") !== -1
//           ? +likeDislikeText.split("/")[0].replace(/\,/g, "")
//           : +likeDislikeText.split("/")[0].replace(/\./g, "");
//       const dislikes =
//         viewText.indexOf(",") !== -1
//           ? +likeDislikeText.split("/")[1].replace(/\,/g, "")
//           : +likeDislikeText.split("/")[1].replace(/\./g, "");

//       let days = Math.floor(
//         Math.abs(new Date().getTime() - new Date(publicAt).getTime()) / 3600000
//       );
      
//       return {
//         views,
//         likes,
//         dislikes,
//         id,
//         title,
//         publicAt,
//         thumbnail,
//         days,
//         date,
//       };
//     } catch (error) {
//       if (error.response) {
//         console.log(error.response.statusText);
//       }
//     }
//   }

//   getJsonVideo(html: string): VideoJson {
//     let htmlCut = html.slice(html.indexOf("var ytInitialData"));
//     htmlCut = htmlCut.slice(
//       "var ytInitialData = ".length,
//       htmlCut.indexOf(";</script")
//     );
//     let videoObject = JSON.parse(htmlCut);
//     return videoObject;
//   }
// }

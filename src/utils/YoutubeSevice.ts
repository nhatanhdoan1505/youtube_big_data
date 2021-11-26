import axios, { AxiosResponse } from "axios";
export class YoutubeService {
  private API_KEYs: string[] = [];
  private INITIAL_KEY: string[] = [];

  constructor(API_KEYs: string[]) {
    this.API_KEYs = [...API_KEYs];
    this.INITIAL_KEY = [...API_KEYs];
  }

  getAllKey() {
    return this.API_KEYs;
  }

  resetApiKey(apiKey = []) {
    this.API_KEYs = apiKey.length === 0 ? this.INITIAL_KEY : apiKey;
  }

  removeExpiredKey(key: string) {
    this.API_KEYs = this.API_KEYs.filter((k) => k !== key);
  }

  getKey() {
    return this.API_KEYs[Math.floor(Math.random() * this.API_KEYs.length)];
  }

  async queryChannelId(userName: string) {
    let response: any;
    for (let i = 0; i < this.API_KEYs.length; i++) {
      try {
        response = await axios.get(
          `https://youtube.googleapis.com/youtube/v3/channels?part=id&forUsername=${userName}&key=${this.API_KEYs[i]}`
        );
      } catch (error) {
        response = error;
      }

      if (response.status !== 200 && !response.data) continue;
      else break;
    }
    return response;
  }

  async queryChannelSnippet(idEndpoint: string) {
    let response: any;
    for (let i = 0; i < this.API_KEYs.length; i++) {
      console.log({ i });
      try {
        response = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&part=snippet${idEndpoint}&key=${this.API_KEYs[i]}`
        );
      } catch (error) {
        response = error;
      }
      console.log(response.status);
      if (response.status !== 200 && !response.data) continue;
      else break;
    }
    console.log(response.data);
    return response;
  }

  async queryVideoSnippet(channelId: string, pageToken = "") {
    let url: string;
    let response: any;
    for (let i = 0; i < this.API_KEYs.length; i++) {
      console.log("QUERY VIDEO SNIPPET", i);
      url =
        pageToken === ""
          ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&key=${this.API_KEYs[i]}`
          : `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&pageToken=${pageToken}&maxResults=50&order=date&key=${this.API_KEYs[i]}`;
      try {
        response = await axios.get(url);
      } catch (error) {
        response = error;
      }

      if (response.status !== 200 && !response.data) continue;
      else break;
    }
    return response;
  }

  async queryVideoStatistics(idEndpoint: string) {
    let url: string;
    let response: any;
    for (let i = 0; i < this.API_KEYs.length; i++) {
      console.log("QUERY VIDEO STATISTIC", i);
      url = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics${idEndpoint}&key=${this.API_KEYs[i]}`;
      try {
        response = await axios.get(url);
      } catch (error) {
        response = error;
      }

      if (response.status !== 200 && !response.data) continue;
      else break;
    }
    return response;
  }
}

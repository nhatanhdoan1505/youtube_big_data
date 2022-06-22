import fs from "fs";
import axios, { AxiosResponse } from "axios";
export class YoutubeService {
  private API_KEYs: string[] = [];
  private INITIAL_KEY: string[] = [];
  private apiKey = fs.readFileSync("apiKey.txt", { encoding: "utf-8" });
  constructor() {
    this.API_KEYs = [...this.apiKey.split(/\n/)];
    this.INITIAL_KEY = [...this.apiKey.split(/\n/)];
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

  sufferApiKey(apiKey: string) {
    let index = this.API_KEYs.findIndex((key) => key === apiKey);
    this.API_KEYs.push(apiKey);
    this.API_KEYs.splice(index, 1);
  }

  outOfDateKey() {
    console.log("CHANGE KEY");
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

      if (response.status !== 200 && !response.data) {
        this.outOfDateKey();
        this.sufferApiKey(this.API_KEYs[i]);
        continue;
      } else break;
    }
    return response;
  }

  async queryChannelSnippet(idEndpoint: string) {
    let response: any;
    for (let i = 0; i < this.API_KEYs.length; i++) {
      try {
        response = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&part=snippet&part=brandingSettings${idEndpoint}&key=${this.API_KEYs[i]}`
        );
      } catch (error) {
        response = error;
      }

      if (response.status !== 200 && !response.data) {
        this.outOfDateKey();
        this.sufferApiKey(this.API_KEYs[i]);
        continue;
      } else break;
    }
    return response;
  }

  async queryVideoListOfChannel(channelId: string, pageToken = "") {
    let url: string;
    let response: any;
    for (let i = 0; i < this.API_KEYs.length; i++) {
      // console.log("QUERY VIDEO SNIPPET", i);
      url =
        pageToken === ""
          ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&key=${this.API_KEYs[i]}`
          : `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&pageToken=${pageToken}&maxResults=50&order=date&key=${this.API_KEYs[i]}`;
      try {
        response = await axios.get(url);
      } catch (error) {
        response = error;
      }

      // console.log("Handler");
      if (response.status !== 200 && !response.data) {
        this.outOfDateKey();
        this.sufferApiKey(this.API_KEYs[i]);
        continue;
      } else break;
    }
    return response;
  }

  async queryVideoInformation(idEndpoint: string) {
    let url: string;
    let response: any;
    for (let i = 0; i < this.API_KEYs.length; i++) {
      // console.log("QUERY VIDEO STATISTIC", i);
      url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&part=status&part=contentDetails${idEndpoint}&key=${this.API_KEYs[i]}`;
      try {
        response = await axios.get(url);
      } catch (error) {
        response = error;
      }

      // console.log("Handler");
      if (response.status !== 200 && !response.data) {
        this.outOfDateKey();
        this.sufferApiKey(this.API_KEYs[i]);
        continue;
      } else break;
    }
    return response;
  }
}

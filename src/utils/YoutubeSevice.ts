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

  resetApiKey() {
    this.API_KEYs = this.INITIAL_KEY;
  }

  removeExpiredKey(key: string) {
    this.API_KEYs = this.API_KEYs.filter((k) => k !== key);
  }

  getKey() {
    return this.API_KEYs[Math.floor(Math.random() * this.API_KEYs.length)];
  }

  async resquestYoutubeHandler(promise: Promise<any>) {
    let response: any;
    for (let i = 0; i < this.API_KEYs.length; i++) {
      response = await promise;
      if (response === false) continue;
      else break;
    }

    return response;
  }

  async queryChannelSnippet(idEndpoint: string) {
    let apiKey = this.getKey();
    let response: AxiosResponse<any> | boolean;
    try {
      response = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&part=snippet${idEndpoint}&key=${apiKey}`
      );
    } catch (error) {
      response = false;
    }
    return response;
  }

  async queryVideoSnippet(channelId: string, pageToken = "") {
    let apiKey = this.getKey();
    let url =
      pageToken === ""
        ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&key=${apiKey}`
        : `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&pageToken=${pageToken}&maxResults=50&order=date&key=${apiKey}`;
    let response: AxiosResponse<any> | boolean;
    try {
      response = await axios.get(url);
    } catch (error) {
      response = false;
    }
    return response;
  }

  async queryVideoStatistics(idEndpoint: string) {
    let apiKey = this.getKey();
    let url = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics${idEndpoint}&key=${apiKey}`;
    let response: AxiosResponse<any> | boolean;
    try {
      response = await axios.get(url);
    } catch (error) {
      response = false;
    }
    return response;
  }
}

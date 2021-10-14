import axios from "axios";

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

  async queryChannelSnippet(idEndpoint: string) {
    let apiKey = this.getKey();
    try {
      return await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&part=snippet${idEndpoint}&key=${apiKey}`
      );
    } catch (error) {
      this.removeExpiredKey(apiKey);
      apiKey = this.getKey();
      return await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&part=snippet${idEndpoint}&key=${apiKey}`
      );
    }
  }

  async queryVideoSnippet(channelId: string, pageToken = "") {
    let apiKey = this.getKey();
    let url =
      pageToken === ""
        ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&key=${apiKey}`
        : `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&pageToken=${pageToken}&maxResults=50&order=date&key=${apiKey}`;

    try {
      return await axios.get(url);
    } catch (error) {
      this.removeExpiredKey(apiKey);
      apiKey = this.getKey();
      url = !pageToken
        ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&key=${apiKey}`
        : `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&pageToken=${pageToken}&maxResults=50&order=date&key=${apiKey}`;

      return await axios.get(url);
    }
  }

  async queryVideoStatistics(idEndpoint: string) {
    let apiKey = this.getKey();
    let url = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics${idEndpoint}&key=${apiKey}`;
    try {
      return await axios.get(url);
    } catch (error) {
      console.log(error.response.data.error.errors);
      this.removeExpiredKey(apiKey);
      apiKey = this.getKey();
      url = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics${idEndpoint}&key=${apiKey}`;
      return await axios.get(url);
    }
  }
}

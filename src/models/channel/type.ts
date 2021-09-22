export interface IChannel {
  label: string;
  urlChannel: string;
  id: string;
  subscribe: number;
  views: number;
  title: string;
  numberVideos: number;
  oldViews: number;
  oldSubscribe: number;
  oldNumberVideos: number;
  videoList: [{
    thumbnail: string;
    id: string;
    title: string;
    publicAt: string;
    days: number;
    likes: number;
    dislikes: number;
    views: number;
    oldViews: number;
  }];
}

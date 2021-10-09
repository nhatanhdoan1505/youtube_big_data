export interface IChannel {
  label: string;
  urlChannel: string;
  id: string;
  subscribe: string;
  views: string;
  title: string;
  numberVideos: string;
  date: string;
  channelThumnail: string;
  videoList: [IVideo];
}

export interface IVideo {
  thumbnail: string;
  id: string;
  title: string;
  publicAt: string;
  days: number;
  likes: string;
  dislikes: string;
  views: string;
  date: string;
}

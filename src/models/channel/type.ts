export interface IChannel {
  label?: string;
  urlChannel: string;
  id: string;
  subscribe: string;
  views: string;
  title: string;
  numberVideos: string;
  date: string;
  channelThumbnail: string;
  videoList: IVideo[];
}

export interface IVideo extends VideoStatistic, VideoDescription {
  thumbnail: string;
  id: string;
  title: string;
  publicAt: string;
  days: number;
  date: string;
}

export interface VideoDescription {
  description: string;
  tags: string[];
}
export interface VideoStatistic {
  likes: string;
  dislikes: string;
  views: string;
  commentCount: string;
}

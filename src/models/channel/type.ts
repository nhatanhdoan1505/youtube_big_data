export interface IChannelBaseInformation {
  label?: string[];
  urlChannel: string;
  id: string;
  subscribe: string;
  views: string;
  title: string;
  numberVideos: string;
  date: string;
  channelThumbnail: string;
  bannerExternalUrl: string;
  description: string;
  publishedAt?: Date;
  tags: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChannel extends IChannelBaseInformation {
  videoList: IVideo[];
}

export interface IVideo extends VideoStatistic, VideoDescription {
  thumbnail: string;
  id: string;
  title: string;
  publicAt?: Date;
  days: number;
  date: string;
}

export interface VideoDescription {
  description: string;
  madeForKids: boolean;
  duration: string;
  tags: string[];
}
export interface VideoStatistic {
  likes: string;
  dislikes: string;
  views: string;
  commentCount: string;
}

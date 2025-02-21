export interface IHotChannel {
  label: string[];
  urlChannel: string;
  id: string;
  subscribe: number;
  views: number;
  title: string;
  numberVideos: number;
  date: string;
  channelThumbnail: string;
  gapSubscribes: number;
  gapViews: number;
  gapNumberVideos: number;
  viewsHistory: string;
  subscribesHistory: string;
  numberVideosHistory: string;
  bannerExternalUrl: string;
  publishedAt?: Date;
  description: string;
  tags: string;
  averageUpload: number;
  createdAt?: Date;
  updatedAt?: Date;
}

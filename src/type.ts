//Channel Id from Api
export interface ChannelIdFromAPI {
  kind: string;
  etag: string;
  pageInfo: PageInfo;
  items?: ItemsEntity[] | null;
}
export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
export interface ItemsEntity {
  kind: string;
  etag: string;
  id: string;
}

// // Channel InformationApi
export interface ChannelInformationApi {
  kind: string;
  etag: string;
  pageInfo: PageInfo;
  items?: ItemsEntity[] | null;
}
export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
export interface ItemsEntity {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  statistics: Statistics;
  brandingSettings: BrandingSettings;
}
export interface Snippet {
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  localized: Localized;
}
export interface Thumbnails {
  default: DefaultOrMediumOrHigh;
  medium: DefaultOrMediumOrHigh;
  high: DefaultOrMediumOrHigh;
}
export interface DefaultOrMediumOrHigh {
  url: string;
  width: number;
  height: number;
}
export interface Localized {
  title: string;
  description: string;
}
export interface Statistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}
export interface BrandingSettings {
  channel: Channel;
  image: Image;
}
export interface Channel {
  title: string;
  description: string;
  keywords: string;
  moderateComments: boolean;
  unsubscribedTrailer: string;
}
export interface Image {
  bannerExternalUrl: string;
}

// Video From API
export interface VideoListFromApi {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: PageInfo;
  items?: ItemsEntityVideo[] | null;
}
export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
export interface ItemsEntityVideo {
  kind: string;
  etag: string;
  id: Id;
  snippet: Snippet;
}
export interface Id {
  kind: string;
  videoId: string;
}
export interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}
export interface Thumbnails {
  default: DefaultOrMediumOrHigh;
  medium: DefaultOrMediumOrHigh;
  high: DefaultOrMediumOrHigh;
}
export interface DefaultOrMediumOrHigh {
  url: string;
  width: number;
  height: number;
}

//Video Information Api
export interface VideoInformationApi {
  kind: string;
  etag: string;
  items?: ItemsEntity[] | null;
  pageInfo: PageInfo;
}
export interface ItemsEntity {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  contentDetails: ContentDetails;
  status: Status;
  statistics: Statistics;
}
export interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  tags?: string[] | null;
  categoryId: string;
  liveBroadcastContent: string;
  localized: Localized;
  defaultAudioLanguage: string;
}
export interface Thumbnails {
  default: DefaultOrMediumOrHighOrStandardOrMaxres;
  medium: DefaultOrMediumOrHighOrStandardOrMaxres;
  high: DefaultOrMediumOrHighOrStandardOrMaxres;
  standard: DefaultOrMediumOrHighOrStandardOrMaxres;
  maxres: DefaultOrMediumOrHighOrStandardOrMaxres;
}
export interface DefaultOrMediumOrHighOrStandardOrMaxres {
  url: string;
  width: number;
  height: number;
}
export interface Localized {
  title: string;
  description: string;
}
export interface ContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  contentRating: ContentRating;
  projection: string;
}
export interface ContentRating {}
export interface Status {
  uploadStatus: string;
  privacyStatus: string;
  license: string;
  embeddable: boolean;
  publicStatsViewable: boolean;
  madeForKids: boolean;
}
export interface Statistics {
  viewCount: string;
  likeCount: string;
  dislikeCount: string;
  favoriteCount: string;
  commentCount: string;
}
export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

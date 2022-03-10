export interface IHotVideo {
  thumbnail: string;
  id: string;
  title: string;
  publicAt: string;
  days: number;
  likes: number;
  dislikes: number;
  views: number;
  date: string;
  description: string;
  tags: string[];
  commentCount: number;
  gapViews: number;
  gapLikes: number;
  gapDislikes: number;
  gapCommentsCount: number;
  commentCountHistory: string;
  viewsHistory: string;
  likesHistory: string;
  dislikesHistory: string;
  channelInformation: {
    urlChannel: string;
    title: string;
  };
}

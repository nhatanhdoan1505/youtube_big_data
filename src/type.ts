export interface ChannelInfor {
  urlChannel: string;
  id: string;
  subscribe: string;
  views: string;
  title: string;
  numberVideos: string;
  videoList: VideoInfor[];
}

export interface VideoInfor extends VideoStatistics {
  thumbnail: string;
  id: string;
  title: string;
  publicAt: string;
  days: number;
  date: string;
}

export interface VideoStatistics {
  likes: number;
  dislikes: number;
  views: string;
}

//Video statistics Api
export interface VideoStatisticsApi {
  kind: string;
  etag: string;
  items?: ItemsEntity[] | null;
  pageInfo: PageInfo;
}
export interface ItemsEntity {
  kind: string;
  etag: string;
  id: string;
  statistics: Statistics;
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

// Json from youtube/wacth

export interface VideoJson {
  responseContext: ResponseContext;
  contents: Contents;
  currentVideoEndpoint: NextEndpointOrNavigationEndpointOrCurrentVideoEndpoint;
  trackingParams: string;
  playerOverlays: PlayerOverlays;
  overlay: Overlay;
  onResponseReceivedEndpoints?:
    | OnResponseReceivedEndpointsEntityOrCommand[]
    | null;
  topbar: Topbar;
  frameworkUpdates: FrameworkUpdates;
}
export interface ResponseContext {
  serviceTrackingParams?: ServiceTrackingParamsEntity[] | null;
  mainAppWebResponseContext: MainAppWebResponseContext;
  webResponseContextExtensionData: WebResponseContextExtensionData;
}
export interface ServiceTrackingParamsEntity {
  service: string;
  params?: ParamsEntity[] | null;
}
export interface ParamsEntity {
  key: string;
  value: string;
}
export interface MainAppWebResponseContext {
  loggedOut: boolean;
}
export interface WebResponseContextExtensionData {
  ytConfigData: YtConfigData;
  webPrefetchData: WebPrefetchData;
  hasDecorated: boolean;
}
export interface YtConfigData {
  visitorData: string;
  rootVisualElementType: number;
}
export interface WebPrefetchData {
  navigationEndpoints?: NavigationEndpointsEntityOrAutoplayVideo[] | null;
}
export interface NavigationEndpointsEntityOrAutoplayVideo {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  watchEndpoint: WatchEndpoint;
}
export interface CommandMetadata {
  webCommandMetadata: WebCommandMetadata;
}
export interface WebCommandMetadata {
  url: string;
  webPageType: string;
  rootVe: number;
}
export interface WatchEndpoint {
  videoId: string;
  params: string;
  playerParams: string;
  watchEndpointSupportedPrefetchConfig: WatchEndpointSupportedPrefetchConfig;
}
export interface WatchEndpointSupportedPrefetchConfig {
  prefetchHintConfig: PrefetchHintConfig;
}
export interface PrefetchHintConfig {
  prefetchPriority: number;
  countdownUiRelativeSecondsPrefetchCondition: number;
}
export interface Contents {
  twoColumnWatchNextResults: TwoColumnWatchNextResults;
}
export interface TwoColumnWatchNextResults {
  results: Results;
  secondaryResults: SecondaryResults;
  autoplay: Autoplay;
}
export interface Results {
  results: Results1;
}
export interface Results1 {
  contents?: ContentsEntity[] | null;
  trackingParams: string;
}
export interface ContentsEntity {
  videoPrimaryInfoRenderer?: VideoPrimaryInfoRenderer | null;
  videoSecondaryInfoRenderer?: VideoSecondaryInfoRenderer | null;
  itemSectionRenderer?: ItemSectionRenderer | null;
}
export interface VideoPrimaryInfoRenderer {
  title: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  viewCount: ViewCount;
  videoActions: VideoActions;
  trackingParams: string;
  sentimentBar: SentimentBar;
  superTitleLink: SuperTitleLink;
  dateText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
}
export interface TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader {
  runs?: RunsEntity[] | null;
}
export interface RunsEntity {
  text: string;
}
export interface ViewCount {
  videoViewCountRenderer: VideoViewCountRenderer;
}
export interface VideoViewCountRenderer {
  viewCount: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  shortViewCount: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
}
export interface ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText {
  simpleText: string;
}
export interface VideoActions {
  menuRenderer: MenuRenderer;
}
export interface MenuRenderer {
  items?: ItemsEntity[] | null;
  trackingParams: string;
  topLevelButtons?: TopLevelButtonsEntity[] | null;
  accessibility: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
}
export interface ItemsEntity {
  menuNavigationItemRenderer: MenuNavigationItemRenderer;
}
export interface MenuNavigationItemRenderer {
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  navigationEndpoint: NavigationEndpoint;
  trackingParams: string;
}
export interface IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage {
  iconType: string;
}
export interface NavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata1;
  modalEndpoint: ModalEndpoint;
}
export interface CommandMetadata1 {
  webCommandMetadata: WebCommandMetadata1;
}
export interface WebCommandMetadata1 {
  ignoreNavigation: boolean;
}
export interface ModalEndpoint {
  modal: Modal;
}
export interface Modal {
  modalWithTitleAndButtonRenderer: ModalWithTitleAndButtonRenderer;
}
export interface ModalWithTitleAndButtonRenderer {
  title: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  content: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  button: Button;
}
export interface Button {
  buttonRenderer: ButtonRenderer;
}
export interface ButtonRenderer {
  style: string;
  size: string;
  isDisabled: boolean;
  text: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  navigationEndpoint: NavigationEndpoint1;
  trackingParams: string;
}
export interface NavigationEndpoint1 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  signInEndpoint: SignInEndpoint;
}
export interface SignInEndpoint {
  hack: boolean;
}
export interface TopLevelButtonsEntity {
  toggleButtonRenderer?: ToggleButtonRenderer | null;
  buttonRenderer?: ButtonRenderer1 | null;
}
export interface ToggleButtonRenderer {
  style: StyleOrToggledStyle;
  isToggled: boolean;
  isDisabled: boolean;
  defaultIcon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  defaultText: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  toggledText: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  accessibility: AccessibilityDataOrAccessibility;
  trackingParams: string;
  defaultTooltip: string;
  toggledTooltip: string;
  toggledStyle: StyleOrToggledStyle;
  defaultNavigationEndpoint: DefaultNavigationEndpoint;
  accessibilityData: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
  toggleButtonSupportedData: ToggleButtonSupportedData;
  targetId: string;
}
export interface StyleOrToggledStyle {
  styleType: string;
}
export interface DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle {
  accessibility: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
  simpleText: string;
}
export interface AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel {
  accessibilityData: AccessibilityDataOrAccessibility;
}
export interface AccessibilityDataOrAccessibility {
  label: string;
}
export interface DefaultNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata1;
  modalEndpoint: ModalEndpoint1;
}
export interface ModalEndpoint1 {
  modal: Modal1;
}
export interface Modal1 {
  modalWithTitleAndButtonRenderer: ModalWithTitleAndButtonRenderer1;
}
export interface ModalWithTitleAndButtonRenderer1 {
  title: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  content: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  button: Button1;
}
export interface Button1 {
  buttonRenderer: ButtonRenderer2;
}
export interface ButtonRenderer2 {
  style: string;
  size: string;
  isDisabled: boolean;
  text: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  navigationEndpoint: NavigationEndpoint2;
  trackingParams: string;
}
export interface NavigationEndpoint2 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  signInEndpoint: SignInEndpoint1;
}
export interface SignInEndpoint1 {
  nextEndpoint: NextEndpointOrNavigationEndpointOrCurrentVideoEndpoint;
  idamTag: string;
}
export interface NextEndpointOrNavigationEndpointOrCurrentVideoEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  watchEndpoint: WatchEndpoint1;
}
export interface WatchEndpoint1 {
  videoId: string;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}
export interface WatchEndpointSupportedOnesieConfig {
  html5PlaybackOnesieConfig: Html5PlaybackOnesieConfig;
}
export interface Html5PlaybackOnesieConfig {
  commonConfig: CommonConfig;
}
export interface CommonConfig {
  url: string;
}
export interface ToggleButtonSupportedData {
  toggleButtonIdData: ToggleButtonIdData;
}
export interface ToggleButtonIdData {
  id: string;
}
export interface ButtonRenderer1 {
  style: string;
  size: string;
  isDisabled: boolean;
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  serviceEndpoint?: ServiceEndpointOrNavigationEndpoint | null;
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  tooltip: string;
  trackingParams: string;
  accessibilityData: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
  navigationEndpoint?: NavigationEndpoint3 | null;
  accessibility?: AccessibilityDataOrAccessibility1 | null;
}
export interface ServiceEndpointOrNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata2;
  shareEntityServiceEndpoint: ShareEntityServiceEndpoint;
}
export interface CommandMetadata2 {
  webCommandMetadata: WebCommandMetadata2;
}
export interface WebCommandMetadata2 {
  sendPost: boolean;
  apiUrl: string;
}
export interface ShareEntityServiceEndpoint {
  serializedShareEntity: string;
  commands?: CommandsEntity[] | null;
}
export interface CommandsEntity {
  clickTrackingParams: string;
  openPopupAction: OpenPopupAction;
}
export interface OpenPopupAction {
  popup: Popup;
  popupType: string;
  beReused: boolean;
}
export interface Popup {
  unifiedSharePanelRenderer: UnifiedSharePanelRenderer;
}
export interface UnifiedSharePanelRenderer {
  trackingParams: string;
  showLoadingSpinner: boolean;
}
export interface NavigationEndpoint3 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata1;
  modalEndpoint: ModalEndpoint2;
}
export interface ModalEndpoint2 {
  modal: Modal2;
}
export interface Modal2 {
  modalWithTitleAndButtonRenderer: ModalWithTitleAndButtonRenderer2;
}
export interface ModalWithTitleAndButtonRenderer2 {
  title: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  content: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  button: Button1;
}
export interface AccessibilityDataOrAccessibility1 {
  label: string;
}
export interface SentimentBar {
  sentimentBarRenderer: SentimentBarRenderer;
}
export interface SentimentBarRenderer {
  percentIfIndifferent: number;
  percentIfLiked: number;
  percentIfDisliked: number;
  likeStatus: string;
  tooltip: string;
}
export interface SuperTitleLink {
  runs?: RunsEntity1[] | null;
}
export interface RunsEntity1 {
  text: string;
  navigationEndpoint: NavigationEndpoint4;
  loggingDirectives: LoggingDirectives;
}
export interface NavigationEndpoint4 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata3;
  browseEndpoint: BrowseEndpoint;
}
export interface CommandMetadata3 {
  webCommandMetadata: WebCommandMetadata3;
}
export interface WebCommandMetadata3 {
  url: string;
  webPageType: string;
  rootVe: number;
  apiUrl: string;
}
export interface BrowseEndpoint {
  browseId: string;
  params: string;
}
export interface LoggingDirectives {
  trackingParams: string;
  visibility: Visibility;
}
export interface Visibility {
  types: string;
}
export interface VideoSecondaryInfoRenderer {
  owner: Owner;
  description: Description;
  subscribeButton: SubscribeButton;
  metadataRowContainer: MetadataRowContainer;
  showMoreText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  showLessText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  trackingParams: string;
  defaultExpanded: boolean;
  descriptionCollapsedLines: number;
}
export interface Owner {
  videoOwnerRenderer: VideoOwnerRenderer;
}
export interface VideoOwnerRenderer {
  thumbnail: ThumbnailOrChannelThumbnailOrBackground;
  title: TitleOrLongBylineTextOrShortBylineTextOrByline;
  subscriptionButton: SubscriptionButtonOrSuggestedPositionOrDismissStrategy;
  navigationEndpoint: NavigationEndpoint5;
  subscriberCountText: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  trackingParams: string;
  badges?: BadgesEntityOrOwnerBadgesEntity[] | null;
}
export interface ThumbnailOrChannelThumbnailOrBackground {
  thumbnails?: ThumbnailsEntity[] | null;
}
export interface ThumbnailsEntity {
  url: string;
  width: number;
  height: number;
}
export interface TitleOrLongBylineTextOrShortBylineTextOrByline {
  runs?: RunsEntity2[] | null;
}
export interface RunsEntity2 {
  text: string;
  navigationEndpoint: NavigationEndpoint5;
}
export interface NavigationEndpoint5 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata3;
  browseEndpoint: BrowseEndpoint1;
}
export interface BrowseEndpoint1 {
  browseId: string;
  canonicalBaseUrl: string;
}
export interface SubscriptionButtonOrSuggestedPositionOrDismissStrategy {
  type: string;
}
export interface BadgesEntityOrOwnerBadgesEntity {
  metadataBadgeRenderer: MetadataBadgeRenderer;
}
export interface MetadataBadgeRenderer {
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  style: string;
  tooltip: string;
  trackingParams: string;
  accessibilityData: AccessibilityDataOrAccessibility;
}
export interface Description {
  runs?: RunsEntity3[] | null;
}
export interface RunsEntity3 {
  text: string;
  navigationEndpoint?: NavigationEndpoint6 | null;
  loggingDirectives?: LoggingDirectives1 | null;
}
export interface NavigationEndpoint6 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata4;
  urlEndpoint?: UrlEndpoint | null;
  browseEndpoint?: BrowseEndpoint2 | null;
}
export interface CommandMetadata4 {
  webCommandMetadata: WebCommandMetadata4;
}
export interface WebCommandMetadata4 {
  url: string;
  webPageType: string;
  rootVe: number;
  apiUrl?: string | null;
}
export interface UrlEndpoint {
  url: string;
  nofollow: boolean;
  target?: string | null;
}
export interface BrowseEndpoint2 {
  browseId: string;
  params: string;
}
export interface LoggingDirectives1 {
  trackingParams: string;
  visibility: Visibility;
}
export interface SubscribeButton {
  buttonRenderer: ButtonRenderer3;
}
export interface ButtonRenderer3 {
  style: string;
  size: string;
  isDisabled: boolean;
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  navigationEndpoint: NavigationEndpoint7;
  trackingParams: string;
  targetId: string;
}
export interface NavigationEndpoint7 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata1;
  modalEndpoint: ModalEndpoint3;
}
export interface ModalEndpoint3 {
  modal: Modal3;
}
export interface Modal3 {
  modalWithTitleAndButtonRenderer: ModalWithTitleAndButtonRenderer3;
}
export interface ModalWithTitleAndButtonRenderer3 {
  title: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  content: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  button: Button2;
}
export interface Button2 {
  buttonRenderer: ButtonRenderer4;
}
export interface ButtonRenderer4 {
  style: string;
  size: string;
  isDisabled: boolean;
  text: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  navigationEndpoint: NavigationEndpoint8;
  trackingParams: string;
}
export interface NavigationEndpoint8 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  signInEndpoint: SignInEndpoint2;
}
export interface SignInEndpoint2 {
  nextEndpoint: NextEndpointOrNavigationEndpointOrCurrentVideoEndpoint;
  continueAction: string;
  idamTag: string;
}
export interface MetadataRowContainer {
  metadataRowContainerRenderer: MetadataRowContainerRenderer;
}
export interface MetadataRowContainerRenderer {
  collapsedItemCount: number;
  trackingParams: string;
}
export interface ItemSectionRenderer {
  contents?: ContentsEntity1[] | null;
  trackingParams: string;
  sectionIdentifier: string;
  targetId: string;
}
export interface ContentsEntity1 {
  continuationItemRenderer: ContinuationItemRenderer;
}
export interface ContinuationItemRenderer {
  trigger: string;
  continuationEndpoint: ContinuationEndpointOrCommand;
}
export interface ContinuationEndpointOrCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata2;
  continuationCommand: ContinuationCommand;
}
export interface ContinuationCommand {
  token: string;
  request: string;
}
export interface SecondaryResults {
  secondaryResults: SecondaryResults1;
}
export interface SecondaryResults1 {
  results?: ResultsEntity[] | null;
  trackingParams: string;
  targetId: string;
}
export interface ResultsEntity {
  compactVideoRenderer?: CompactVideoRenderer | null;
  compactRadioRenderer?: CompactRadioRenderer | null;
  continuationItemRenderer?: ContinuationItemRenderer1 | null;
}
export interface CompactVideoRenderer {
  videoId: string;
  thumbnail: ThumbnailOrChannelThumbnailOrBackground;
  title: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  longBylineText: TitleOrLongBylineTextOrShortBylineTextOrByline;
  publishedTimeText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  viewCountText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  lengthText: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  navigationEndpoint: NavigationEndpoint9;
  shortBylineText: TitleOrLongBylineTextOrShortBylineTextOrByline;
  badges?: BadgesEntity[] | null;
  channelThumbnail: ThumbnailOrChannelThumbnailOrBackground;
  ownerBadges?: BadgesEntityOrOwnerBadgesEntity[] | null;
  trackingParams: string;
  shortViewCountText: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  menu: Menu;
  thumbnailOverlays?: ThumbnailOverlaysEntity[] | null;
  accessibility: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
}
export interface NavigationEndpoint9 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  watchEndpoint: WatchEndpoint2;
}
export interface WatchEndpoint2 {
  videoId: string;
  nofollow: boolean;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}
export interface BadgesEntity {
  metadataBadgeRenderer: MetadataBadgeRenderer1;
}
export interface MetadataBadgeRenderer1 {
  style: string;
  label: string;
  trackingParams: string;
}
export interface Menu {
  menuRenderer: MenuRenderer1;
}
export interface MenuRenderer1 {
  items?: ItemsEntity1[] | null;
  trackingParams: string;
  accessibility: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
  targetId?: string | null;
}
export interface ItemsEntity1 {
  menuServiceItemRenderer: MenuServiceItemRenderer;
}
export interface MenuServiceItemRenderer {
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  serviceEndpoint: ServiceEndpoint;
  trackingParams: string;
}
export interface ServiceEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata5;
  signalServiceEndpoint: SignalServiceEndpoint;
}
export interface CommandMetadata5 {
  webCommandMetadata: WebCommandMetadata5;
}
export interface WebCommandMetadata5 {
  sendPost: boolean;
}
export interface SignalServiceEndpoint {
  signal: string;
  actions?: ActionsEntity[] | null;
}
export interface ActionsEntity {
  clickTrackingParams: string;
  addToPlaylistCommand?: AddToPlaylistCommand | null;
  openPopupAction?: OpenPopupAction1 | null;
}
export interface AddToPlaylistCommand {
  openMiniplayer: boolean;
  openListPanel: boolean;
  videoId: string;
  listType: string;
  onCreateListCommand: OnCreateListCommand;
  videoIds?: string[] | null;
}
export interface OnCreateListCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata2;
  createPlaylistServiceEndpoint: CreatePlaylistServiceEndpoint;
}
export interface CreatePlaylistServiceEndpoint {
  videoIds?: string[] | null;
  params: string;
}
export interface OpenPopupAction1 {
  popup: Popup1;
  popupType: string;
}
export interface Popup1 {
  notificationActionRenderer: NotificationActionRenderer;
}
export interface NotificationActionRenderer {
  responseText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  trackingParams: string;
}
export interface ThumbnailOverlaysEntity {
  thumbnailOverlayTimeStatusRenderer?: ThumbnailOverlayTimeStatusRenderer | null;
  thumbnailOverlayToggleButtonRenderer?: ThumbnailOverlayToggleButtonRenderer | null;
  thumbnailOverlayNowPlayingRenderer?: ThumbnailOverlayNowPlayingRenderer | null;
}
export interface ThumbnailOverlayTimeStatusRenderer {
  text: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  style: string;
}
export interface ThumbnailOverlayToggleButtonRenderer {
  isToggled?: boolean | null;
  untoggledIcon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  toggledIcon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  untoggledTooltip: string;
  toggledTooltip: string;
  untoggledServiceEndpoint: UntoggledServiceEndpoint;
  toggledServiceEndpoint?: ToggledServiceEndpoint | null;
  untoggledAccessibility: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
  toggledAccessibility: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
  trackingParams: string;
}
export interface UntoggledServiceEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata6;
  playlistEditEndpoint?: PlaylistEditEndpoint | null;
  signalServiceEndpoint?: SignalServiceEndpoint1 | null;
}
export interface CommandMetadata6 {
  webCommandMetadata: WebCommandMetadata6;
}
export interface WebCommandMetadata6 {
  sendPost: boolean;
  apiUrl?: string | null;
}
export interface PlaylistEditEndpoint {
  playlistId: string;
  actions?: ActionsEntity1[] | null;
}
export interface ActionsEntity1 {
  addedVideoId: string;
  action: string;
}
export interface SignalServiceEndpoint1 {
  signal: string;
  actions?: ActionsEntity2[] | null;
}
export interface ActionsEntity2 {
  clickTrackingParams: string;
  addToPlaylistCommand: AddToPlaylistCommand1;
}
export interface AddToPlaylistCommand1 {
  openMiniplayer: boolean;
  openListPanel: boolean;
  videoId: string;
  listType: string;
  onCreateListCommand: OnCreateListCommand;
  videoIds?: string[] | null;
}
export interface ToggledServiceEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata2;
  playlistEditEndpoint: PlaylistEditEndpoint1;
}
export interface PlaylistEditEndpoint1 {
  playlistId: string;
  actions?: ActionsEntity3[] | null;
}
export interface ActionsEntity3 {
  action: string;
  removedVideoId: string;
}
export interface ThumbnailOverlayNowPlayingRenderer {
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
}
export interface CompactRadioRenderer {
  playlistId: string;
  thumbnail: ThumbnailOrChannelThumbnailOrBackground;
  title: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  navigationEndpoint: NavigationEndpoint10;
  videoCountText: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  secondaryNavigationEndpoint: SecondaryNavigationEndpoint;
  shortBylineText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  longBylineText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  trackingParams: string;
  thumbnailText: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  videoCountShortText: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  shareUrl: string;
  thumbnailOverlays?: ThumbnailOverlaysEntity1[] | null;
}
export interface NavigationEndpoint10 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  watchEndpoint: WatchEndpoint3;
}
export interface WatchEndpoint3 {
  videoId: string;
  playlistId: string;
  params: string;
  continuePlayback: boolean;
  loggingContext: LoggingContext;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}
export interface LoggingContext {
  vssLoggingContext: VssLoggingContext;
}
export interface VssLoggingContext {
  serializedContextData: string;
}
export interface SecondaryNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  watchEndpoint: WatchEndpoint4;
}
export interface WatchEndpoint4 {
  videoId: string;
  playlistId: string;
  params: string;
  loggingContext: LoggingContext;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}
export interface ThumbnailOverlaysEntity1 {
  thumbnailOverlayBottomPanelRenderer?: ThumbnailOverlayBottomPanelRenderer | null;
  thumbnailOverlayHoverTextRenderer?: ThumbnailOverlayHoverTextRenderer | null;
  thumbnailOverlayNowPlayingRenderer?: ThumbnailOverlayNowPlayingRenderer1 | null;
}
export interface ThumbnailOverlayBottomPanelRenderer {
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
}
export interface ThumbnailOverlayHoverTextRenderer {
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
}
export interface ThumbnailOverlayNowPlayingRenderer1 {
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
}
export interface ContinuationItemRenderer1 {
  trigger: string;
  continuationEndpoint: ContinuationEndpointOrCommand;
  button: Button3;
}
export interface Button3 {
  buttonRenderer: ButtonRenderer5;
}
export interface ButtonRenderer5 {
  style: string;
  size: string;
  isDisabled: boolean;
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  trackingParams: string;
  command: ContinuationEndpointOrCommand;
}
export interface Autoplay {
  autoplay: Autoplay1;
}
export interface Autoplay1 {
  sets?: SetsEntity[] | null;
  countDownSecs: number;
  trackingParams: string;
}
export interface SetsEntity {
  mode: string;
  autoplayVideo: NavigationEndpointsEntityOrAutoplayVideo;
}
export interface PlayerOverlays {
  playerOverlayRenderer: PlayerOverlayRenderer;
}
export interface PlayerOverlayRenderer {
  endScreen: EndScreen;
  autoplay: Autoplay2;
  shareButton: ShareButton;
  addToMenu: AddToMenu;
  videoDetails: VideoDetails;
}
export interface EndScreen {
  watchNextEndScreenRenderer: WatchNextEndScreenRenderer;
}
export interface WatchNextEndScreenRenderer {
  results?: ResultsEntity1[] | null;
  title: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  trackingParams: string;
}
export interface ResultsEntity1 {
  endScreenVideoRenderer?: EndScreenVideoRenderer | null;
  endScreenPlaylistRenderer?: EndScreenPlaylistRenderer | null;
}
export interface EndScreenVideoRenderer {
  videoId: string;
  thumbnail: ThumbnailOrChannelThumbnailOrBackground;
  title: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  shortBylineText: TitleOrLongBylineTextOrShortBylineTextOrByline;
  lengthText: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  lengthInSeconds: number;
  navigationEndpoint: NextEndpointOrNavigationEndpointOrCurrentVideoEndpoint;
  trackingParams: string;
  shortViewCountText: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  publishedTimeText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  thumbnailOverlays?: ThumbnailOverlaysEntity2[] | null;
}
export interface ThumbnailOverlaysEntity2 {
  thumbnailOverlayTimeStatusRenderer?: ThumbnailOverlayTimeStatusRenderer1 | null;
  thumbnailOverlayNowPlayingRenderer?: ThumbnailOverlayNowPlayingRenderer2 | null;
}
export interface ThumbnailOverlayTimeStatusRenderer1 {
  text: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  style: string;
}
export interface ThumbnailOverlayNowPlayingRenderer2 {
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
}
export interface EndScreenPlaylistRenderer {
  playlistId: string;
  title: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  thumbnail: ThumbnailOrChannelThumbnailOrBackground;
  longBylineText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  videoCountText: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  navigationEndpoint: NavigationEndpoint10;
  trackingParams: string;
}
export interface Autoplay2 {
  playerOverlayAutoplayRenderer: PlayerOverlayAutoplayRenderer;
}
export interface PlayerOverlayAutoplayRenderer {
  title: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  videoTitle: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  byline: TitleOrLongBylineTextOrShortBylineTextOrByline;
  cancelText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  pauseText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  background: ThumbnailOrChannelThumbnailOrBackground;
  countDownSecs: number;
  nextButton: NextButton;
  trackingParams: string;
  thumbnailOverlays?: ThumbnailOverlaysEntity3[] | null;
  preferImmediateRedirect: boolean;
  videoId: string;
  publishedTimeText: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  webShowNewAutonavCountdown: boolean;
  webShowBigThumbnailEndscreen: boolean;
  shortViewCountText: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
}
export interface NextButton {
  buttonRenderer: ButtonRenderer6;
}
export interface ButtonRenderer6 {
  style: string;
  size: string;
  isDisabled: boolean;
  navigationEndpoint: NextEndpointOrNavigationEndpointOrCurrentVideoEndpoint;
  accessibility: AccessibilityDataOrAccessibility;
  trackingParams: string;
}
export interface ThumbnailOverlaysEntity3 {
  thumbnailOverlayTimeStatusRenderer: ThumbnailOverlayTimeStatusRenderer2;
}
export interface ThumbnailOverlayTimeStatusRenderer2 {
  text: DefaultTextOrToggledTextOrSubscriberCountTextOrTextOrTitleOrLengthTextOrShortViewCountTextOrVideoTitle;
  style: string;
}
export interface ShareButton {
  buttonRenderer: ButtonRenderer7;
}
export interface ButtonRenderer7 {
  style: string;
  size: string;
  isDisabled: boolean;
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  navigationEndpoint: ServiceEndpointOrNavigationEndpoint1;
  tooltip: string;
  trackingParams: string;
}
export interface ServiceEndpointOrNavigationEndpoint1 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata2;
  shareEntityServiceEndpoint: ShareEntityServiceEndpoint;
}
export interface AddToMenu {
  menuRenderer: MenuRenderer2;
}
export interface MenuRenderer2 {
  trackingParams: string;
}
export interface VideoDetails {
  playerOverlayVideoDetailsRenderer: PlayerOverlayVideoDetailsRenderer;
}
export interface PlayerOverlayVideoDetailsRenderer {
  title: ViewCountOrShortViewCountOrTextOrTitleOrContentOrDateTextOrShowMoreTextOrShowLessTextOrResponseTextOrPublishedTimeTextOrViewCountTextOrShortBylineTextOrLongBylineTextOrCancelTextOrPauseText;
  subtitle: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
}
export interface Overlay {
  tooltipRenderer: TooltipRenderer;
}
export interface TooltipRenderer {
  promoConfig: PromoConfig;
  targetId: string;
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  detailsText: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  dismissButton: DismissButton;
  suggestedPosition: SubscriptionButtonOrSuggestedPositionOrDismissStrategy;
  dismissStrategy: SubscriptionButtonOrSuggestedPositionOrDismissStrategy;
  dwellTimeMs: string;
  trackingParams: string;
}
export interface PromoConfig {
  promoId: string;
  impressionEndpoints?:
    | ImpressionEndpointsEntityOrAcceptCommandOrDismissCommandOrCommandsEntity[]
    | null;
  acceptCommand: ImpressionEndpointsEntityOrAcceptCommandOrDismissCommandOrCommandsEntity;
  dismissCommand: ImpressionEndpointsEntityOrAcceptCommandOrDismissCommandOrCommandsEntity;
}
export interface ImpressionEndpointsEntityOrAcceptCommandOrDismissCommandOrCommandsEntity {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata2;
  feedbackEndpoint: FeedbackEndpoint;
}
export interface FeedbackEndpoint {
  feedbackToken: string;
  uiActions: UiActions;
}
export interface UiActions {
  hideEnclosingContainer: boolean;
}
export interface DismissButton {
  buttonRenderer: ButtonRenderer8;
}
export interface ButtonRenderer8 {
  style: string;
  size: string;
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  trackingParams: string;
  command: Command;
}
export interface Command {
  clickTrackingParams: string;
  commandExecutorCommand: CommandExecutorCommand;
}
export interface CommandExecutorCommand {
  commands?:
    | ImpressionEndpointsEntityOrAcceptCommandOrDismissCommandOrCommandsEntity[]
    | null;
}
export interface OnResponseReceivedEndpointsEntityOrCommand {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata5;
  signalServiceEndpoint: SignalServiceEndpoint2;
}
export interface SignalServiceEndpoint2 {
  signal: string;
  actions?: ActionsEntity4[] | null;
}
export interface ActionsEntity4 {
  clickTrackingParams: string;
  signalAction: SignalAction;
}
export interface SignalAction {
  signal: string;
}
export interface Topbar {
  desktopTopbarRenderer: DesktopTopbarRenderer;
}
export interface DesktopTopbarRenderer {
  logo: Logo;
  searchbox: Searchbox;
  trackingParams: string;
  countryCode: string;
  topbarButtons?: TopbarButtonsEntity[] | null;
  hotkeyDialog: HotkeyDialog;
  backButton: BackButtonOrForwardButton;
  forwardButton: BackButtonOrForwardButton;
  a11ySkipNavigationButton: A11ySkipNavigationButton;
  voiceSearchButton: VoiceSearchButton;
}
export interface Logo {
  topbarLogoRenderer: TopbarLogoRenderer;
}
export interface TopbarLogoRenderer {
  iconImage: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  tooltipText: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  endpoint: Endpoint;
  trackingParams: string;
  overrideEntityKey: string;
}
export interface Endpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata3;
  browseEndpoint: BrowseEndpoint3;
}
export interface BrowseEndpoint3 {
  browseId: string;
}
export interface Searchbox {
  fusionSearchboxRenderer: FusionSearchboxRenderer;
}
export interface FusionSearchboxRenderer {
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  placeholderText: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  config: Config;
  trackingParams: string;
  searchEndpoint: SearchEndpoint;
  clearButton: ClearButtonOrExitButton;
}
export interface Config {
  webSearchboxConfig: WebSearchboxConfig;
}
export interface WebSearchboxConfig {
  requestLanguage: string;
  requestDomain: string;
  hasOnscreenKeyboard: boolean;
  focusSearchbox: boolean;
}
export interface SearchEndpoint {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  searchEndpoint: SearchEndpoint1;
}
export interface SearchEndpoint1 {
  query: string;
}
export interface ClearButtonOrExitButton {
  buttonRenderer: ButtonRenderer9;
}
export interface ButtonRenderer9 {
  style: string;
  size: string;
  isDisabled: boolean;
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  trackingParams: string;
  accessibilityData: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
}
export interface TopbarButtonsEntity {
  topbarMenuButtonRenderer?: TopbarMenuButtonRenderer | null;
  buttonRenderer?: ButtonRenderer10 | null;
}
export interface TopbarMenuButtonRenderer {
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  menuRenderer?: MenuRenderer3 | null;
  trackingParams: string;
  accessibility: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
  tooltip: string;
  style: string;
  targetId?: string | null;
  menuRequest?: MenuRequest | null;
}
export interface MenuRenderer3 {
  multiPageMenuRenderer: MultiPageMenuRenderer;
}
export interface MultiPageMenuRenderer {
  sections?: SectionsEntity[] | null;
  trackingParams: string;
  style: string;
}
export interface SectionsEntity {
  multiPageMenuSectionRenderer: MultiPageMenuSectionRenderer;
}
export interface MultiPageMenuSectionRenderer {
  items?: ItemsEntity2[] | null;
  trackingParams: string;
}
export interface ItemsEntity2 {
  compactLinkRenderer: CompactLinkRenderer;
}
export interface CompactLinkRenderer {
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  title: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  navigationEndpoint: NavigationEndpoint11;
  trackingParams: string;
}
export interface NavigationEndpoint11 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  urlEndpoint: UrlEndpoint1;
}
export interface UrlEndpoint1 {
  url: string;
  target: string;
}
export interface MenuRequest {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata2;
  signalServiceEndpoint: SignalServiceEndpoint3;
}
export interface SignalServiceEndpoint3 {
  signal: string;
  actions?: ActionsEntity5[] | null;
}
export interface ActionsEntity5 {
  clickTrackingParams: string;
  openPopupAction: OpenPopupAction2;
}
export interface OpenPopupAction2 {
  popup: Popup2;
  popupType: string;
  beReused: boolean;
}
export interface Popup2 {
  multiPageMenuRenderer: MultiPageMenuRenderer1;
}
export interface MultiPageMenuRenderer1 {
  trackingParams: string;
  style: string;
  showLoadingSpinner: boolean;
}
export interface ButtonRenderer10 {
  style: string;
  size: string;
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  navigationEndpoint: NavigationEndpoint12;
  trackingParams: string;
  targetId: string;
}
export interface NavigationEndpoint12 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata;
  signInEndpoint: SignInEndpoint3;
}
export interface SignInEndpoint3 {
  idamTag: string;
}
export interface HotkeyDialog {
  hotkeyDialogRenderer: HotkeyDialogRenderer;
}
export interface HotkeyDialogRenderer {
  title: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  sections?: SectionsEntity1[] | null;
  dismissButton: DismissButton1;
  trackingParams: string;
}
export interface SectionsEntity1 {
  hotkeyDialogSectionRenderer: HotkeyDialogSectionRenderer;
}
export interface HotkeyDialogSectionRenderer {
  title: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  options?: OptionsEntity[] | null;
}
export interface OptionsEntity {
  hotkeyDialogSectionOptionRenderer: HotkeyDialogSectionOptionRenderer;
}
export interface HotkeyDialogSectionOptionRenderer {
  label: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  hotkey: string;
  hotkeyAccessibilityLabel?: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel1 | null;
}
export interface AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel1 {
  accessibilityData: AccessibilityDataOrAccessibility;
}
export interface DismissButton1 {
  buttonRenderer: ButtonRenderer11;
}
export interface ButtonRenderer11 {
  style: string;
  size: string;
  isDisabled: boolean;
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  trackingParams: string;
}
export interface BackButtonOrForwardButton {
  buttonRenderer: ButtonRenderer12;
}
export interface ButtonRenderer12 {
  trackingParams: string;
  command: OnResponseReceivedEndpointsEntityOrCommand;
}
export interface A11ySkipNavigationButton {
  buttonRenderer: ButtonRenderer13;
}
export interface ButtonRenderer13 {
  style: string;
  size: string;
  isDisabled: boolean;
  text: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  trackingParams: string;
  command: OnResponseReceivedEndpointsEntityOrCommand;
}
export interface VoiceSearchButton {
  buttonRenderer: ButtonRenderer14;
}
export interface ButtonRenderer14 {
  style: string;
  size: string;
  isDisabled: boolean;
  serviceEndpoint: ServiceEndpoint1;
  icon: IconOrDefaultIconOrUntoggledIconOrToggledIconOrIconImage;
  tooltip: string;
  trackingParams: string;
  accessibilityData: AccessibilityOrAccessibilityDataOrUntoggledAccessibilityOrToggledAccessibilityOrHotkeyAccessibilityLabel;
}
export interface ServiceEndpoint1 {
  clickTrackingParams: string;
  commandMetadata: CommandMetadata5;
  signalServiceEndpoint: SignalServiceEndpoint4;
}
export interface SignalServiceEndpoint4 {
  signal: string;
  actions?: ActionsEntity6[] | null;
}
export interface ActionsEntity6 {
  clickTrackingParams: string;
  openPopupAction: OpenPopupAction3;
}
export interface OpenPopupAction3 {
  popup: Popup3;
  popupType: string;
}
export interface Popup3 {
  voiceSearchDialogRenderer: VoiceSearchDialogRenderer;
}
export interface VoiceSearchDialogRenderer {
  placeholderHeader: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  promptHeader: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  exampleQuery1: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  exampleQuery2: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  promptMicrophoneLabel: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  loadingHeader: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  connectionErrorHeader: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  connectionErrorMicrophoneLabel: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  permissionsHeader: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  permissionsSubtext: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  disabledHeader: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  disabledSubtext: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
  exitButton: ClearButtonOrExitButton;
  trackingParams: string;
  microphoneOffPromptHeader: TitleOrContentOrTextOrVideoCountTextOrThumbnailTextOrVideoCountShortTextOrSubtitleOrDetailsTextOrTooltipTextOrPlaceholderTextOrLabelOrPlaceholderHeaderOrPromptHeaderOrExampleQuery1OrExampleQuery2OrPromptMicrophoneLabelOrLoadingHeaderOrConnectionErrorHeaderOrConnectionErrorMicrophoneLabelOrPermissionsHeaderOrPermissionsSubtextOrDisabledHeaderOrDisabledSubtextOrMicrophoneOffPromptHeader;
}
export interface FrameworkUpdates {
  entityBatchUpdate: EntityBatchUpdate;
}
export interface EntityBatchUpdate {
  mutations?: MutationsEntity[] | null;
  timestamp: Timestamp;
}
export interface MutationsEntity {
  entityKey: string;
  type: string;
  options: Options;
}
export interface Options {
  persistenceOption: string;
}
export interface Timestamp {
  seconds: string;
  nanos: number;
}

// Channel InforApi
export interface ChannelInfroApi {
  kind: string;
  etag: string;
  pageInfo: PageInfo;
  items?: ItemsEntityChannel[] | null;
}
export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}
export interface ItemsEntityChannel {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  statistics: Statistics;
}
export interface Snippet {
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: Thumbnails;
  localized: Localized;
  country: string;
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

// Video From API
export interface VideoFromApi {
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

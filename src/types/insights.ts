export type TabType = 'overview' | 'engagement' | 'audience';
export type AudienceSubTab = 'age' | 'country' | 'gender';
export type ViewsChartFilter = 'all' | 'followers' | 'non_followers';

export interface TopMetrics {
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  saves: number;
}

export interface SummaryData {
  views: number;
  viewers: number;
  averageWatchTime: string; // e.g. "11s" or "1m 14s"
  follows: number;
}

export interface ChartDataPoint {
  id: string;
  label: string; // e.g. "12 Sept", "21 Sept", "29 Sept"
  all: number;
  followers: number;
  nonFollowers: number;
  typical?: number; // "Your typical reel" baseline value
  hasData?: boolean; // If false (future time), "This reel" line stops before this point
}

export interface ImpactFactor {
  id: string;
  name: string; // e.g. "Skip rate", "Share rate", "Like rate", "Save rate", "Repost rate", "Comment rate"
  rate: number; // e.g. 11.9
  status: 'Lower' | 'Higher' | 'Typical';
  iconType: 'skip' | 'share' | 'like' | 'save' | 'repost' | 'comment';
}

export interface RetentionPoint {
  time: string; // e.g. "0:00", "0:03", "0:10", "0:25"
  percentage: number; // e.g. 100, 58, 12, 10
}

export interface ViewSource {
  id: string;
  name: string; // e.g. "Reels tab", "Explore", "Profile", "Feed"
  percentage: number; // e.g. 42.1
}

export interface DemographicItem {
  id: string;
  name: string; // e.g. "18-24", "India", "Men"
  percentage: number; // e.g. 27.4
}

export interface AudienceData {
  followersPercentage: number; // e.g. 0.0
  nonFollowersPercentage: number; // e.g. 100.0
  age: DemographicItem[];
  country: DemographicItem[];
  gender: DemographicItem[];
}

export interface EngagementData {
  followsAfterViewing: number;
  whenLikedPoints: RetentionPoint[];
}

export interface ReelInsightsState {
  title: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  mediaAspectRatio: string; // e.g. "9/16" or "4/5"
  topMetrics: TopMetrics;
  summary: SummaryData;
  viewsChart: {
    dates: string[];
    points: ChartDataPoint[];
    yMax: number;
  };
  impactFactors: ImpactFactor[];
  watchTimeRetention: {
    videoDuration: string; // e.g. "0:25"
    points: RetentionPoint[];
  };
  topSources: ViewSource[];
  engagement: EngagementData;
  audience: AudienceData;
}

export type EditFieldType = 
  | 'text'
  | 'number'
  | 'percentage'
  | 'time'
  | 'date'
  | 'status_tag'
  | 'country_select'
  | 'chart_point'
  | 'source_item'
  | 'demographic_item';

export interface ActiveEditTarget {
  path: string; // e.g. "summary.views" or "audience.country.0.name"
  title: string;
  type: EditFieldType;
  value: any;
  options?: {
    min?: number;
    max?: number;
    step?: number;
    parentIndex?: number;
    unit?: string;
  };
}

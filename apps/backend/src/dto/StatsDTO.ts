import { StatsRows } from "./PageViewDTO";

export interface StatsDTO {
  uniqueVisitors: number;
  totalVisits: number;
  totalPageViews: number;
  viewsPerVisit: number;
  bounceRate: number;
  visitDuration: number;
  topPages: Array<StatsRows>;
  topSource: Array<StatsRows>;
  countries: Array<StatsRows>;
  browsers: Array<StatsRows>;
  oses: Array<StatsRows>;
  devices: Array<StatsRows>;
}

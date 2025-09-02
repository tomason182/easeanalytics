import { PageView } from "../entities/PageView";
import { totalViews, StatsRows } from "../../dto/PageViewDTO";

export interface IPageViewsRepository {
  // Record a visit
  record(pageViews: PageView): Promise<void>;

  // Delete old record. Should be an automatic process.
  // Seems better to use a script directly.
  //deleteOldViews(pageId: number, olderThan: Date): Promise<void>;

  // Get unique visitors
  getUniqueVisitors(websiteId: number, days: number): Promise<totalViews>;

  // Get total visits
  getTotalViews(websiteId: number): Promise<totalViews>;

  // Get views by interval
  getViewsByInterval(websiteId: number, days: number): Promise<totalViews>;

  // Current visitors
  getCurrentVisitors(websiteId: number): Promise<totalViews>;

  // Views per visit

  // Bounce rate

  // Visit duration

  // Top sources
  getViewsBySource(websiteId: number, days: number): Promise<StatsRows[]>;

  // Top Pages
  getViewsByPageURL(websiteId: number, days: number): Promise<StatsRows[]>;

  // Countries
  getViewsByCountry(websiteId: number, days: number): Promise<StatsRows[]>;

  // Devices
  getViewsByDevice(websiteId: number, days: number): Promise<StatsRows[]>;

  // OS
  getViewsByOS(websiteId: number, days: number): Promise<StatsRows[]>;
}

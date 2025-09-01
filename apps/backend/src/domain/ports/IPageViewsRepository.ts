import { PageViews } from "../entities/PageViews";

export interface IPageViewsRepository {
  record(pageViews: PageViews): Promise<void>;

  getTotalViewsByPage(pageId: number): Promise<number>;

  getTotalViewsByDataRange(
    pageId: number,
    start: Date,
    end: Date
  ): Promise<number>;

  getUniqueVisitors(pageId: number): Promise<number>;

  deleteOldViews(pageId: number, olderThan: Date): Promise<void>;
}

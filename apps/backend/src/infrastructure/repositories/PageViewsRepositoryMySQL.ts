import { IPageViewsRepository } from "../../domain/ports/IPageViewsRepository";
import { PageView } from "../../domain/entities/PageView";
import { UnitOfWork } from "../transactions/UnitOfWork";
import { PageViewDTO, StatsRows } from "../../dto/PageViewDTO";
import { RowDataPacket } from "mysql2";

export class PageViewsRepositoryMySQL implements IPageViewsRepository {
  private uow: UnitOfWork;

  constructor(uow: UnitOfWork) {
    this.uow = uow;
  }

  async record(pageview: PageView): Promise<void> {
    const conn = await this.uow.getConnection();
    const query =
      "INSERT INTO page_views (website_id, visitor_id, page_url, referrer, device_type, browser, os, country) VALUES (?,?,?,?,?,?,?,?);";
    const params = [
      pageview.getWebsiteId(),
      pageview.getVisitorId(),
      pageview.getPageUrl(),
      pageview.getReferrer(),
      pageview.getDeviceType(),
      pageview.getBrowser(),
      pageview.getOS(),
      pageview.getCountry(),
    ];

    await conn.execute<PageViewDTO[]>(query, params);
  }

  // Get unique visitors
  async getUniqueVisitors(websiteId: number, days: number): Promise<number> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT COUNT(DISTINCT visitor_id) AS visitors FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY;";

    const [rows] = await conn.execute<RowDataPacket[]>(query, [
      websiteId,
      days,
    ]);

    return rows[0]?.visitors ?? 0;
  }

  // Get total pageviews
  async getTotalViews(websiteId: number, days: number): Promise<number> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT COUNT(*) AS total_page_views FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY;";

    const [rows] = await conn.execute<RowDataPacket[]>(query, [
      websiteId,
      days,
    ]);

    return rows[0]?.total_page_views ?? 0;
  }

  // Get Total visits by interval
  async getViewsByInterval(websiteId: number, days: number): Promise<number> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT COUNT(*) AS visitors FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY;";

    const [rows] = await conn.execute<RowDataPacket[]>(query, [
      websiteId,
      days,
    ]);

    return rows[0]?.visitors ?? 0;
  }

  // Get current visitors
  async getCurrentVisitors(websiteId: number): Promise<number> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT COUNT(DISTINCT visitor_id) AS total_views FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL 5 MINUTE";

    const [rows] = await conn.execute<RowDataPacket[]>(query, [websiteId]);

    return rows[0]?.total_views ?? 0;
  }

  // Get pageviews by source
  async getViewsBySource(
    websiteId: number,
    days: number
  ): Promise<StatsRows[]> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT source, COUNT(*) as total_views FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY GROUP BY source ORDER BY total_views DESC;";

    const [rows] = await conn.execute<StatsRows[]>(query, [websiteId, days]);

    return rows;
  }

  // Get pageviews by country
  async getViewsByCountry(
    websiteId: number,
    days: number
  ): Promise<StatsRows[]> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT country, COUNT(*) as total_views FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY GROUP BY country ORDER BY total_views DESC;";

    const [rows] = await conn.execute<StatsRows[]>(query, [websiteId, days]);

    return rows;
  }

  // Get pageviews by path
  async getViewsByPageURL(
    websiteId: number,
    days: number
  ): Promise<StatsRows[]> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT pageUrl, COUNT(*) as total_views FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY GROUP BY page_url ORDER BY total_views DESC";

    const [rows] = await conn.execute<StatsRows[]>(query, [websiteId, days]);

    return rows;
  }

  // Get page views by device
  async getViewsByDevice(
    websiteId: number,
    days: number
  ): Promise<StatsRows[]> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT device, COUNT(*) AS total_views FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY GROUP BY device ORDER BY total_views DESC;";

    const [rows] = await conn.execute<StatsRows[]>(query, [websiteId, days]);

    return rows;
  }

  // Get views by browser
  async getViewsByBrowser(
    websiteId: number,
    days: number
  ): Promise<StatsRows[]> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT browser, COUNT(*) AS total_views FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY GROUP BY browser ORDER BY total_views DESC;";

    const [rows] = await conn.execute<StatsRows[]>(query, [websiteId, days]);

    return rows;
  }

  // Get page views by OS
  async getViewsByOS(websiteId: number, days: number): Promise<StatsRows[]> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT os, COUNT(*) AS total_views FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY GROUP BY os ORDER BY total_views DESC;";

    const [rows] = await conn.execute<StatsRows[]>(query, [websiteId, days]);

    return rows;
  }

  // Get single page session.
  async getSinglePageSession(websiteId: number, days: number): Promise<number> {
    const conn = await this.uow.getConnection();
    const query =
      "SELECT COUNT(*) AS single_page_visits FROM (SELECT visitor_id, COUNT(*) AS views FROM page_views WHERE website_id = ? AND viewed_at >= NOW() - INTERVAL ? DAY GROUP BY visitor_id HAVING views = 1) AS single_visitors;";

    const [rows] = await conn.execute<RowDataPacket[]>(query, [
      websiteId,
      days,
    ]);

    return rows[0]?.single_page_visits ?? 0;
  }
}

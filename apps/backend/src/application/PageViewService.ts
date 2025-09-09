import { PageView } from "../domain/entities/PageView";
import { Stats } from "../domain/entities/Stats";
import { IPageViewsRepository } from "../domain/ports/IPageViewsRepository";
import { IWebsiteRepository } from "../domain/ports/IWebsiteRepository";
import { PageViewDTO } from "../dto/PageViewDTO";
import { ScriptDTO } from "../dto/ScriptDTO";
import { ISessionCacheRepository } from "../infrastructure/cache/interfaces/ISessionCacheRepository";
import { IPageViewsService } from "./interfaces/IPageViewsService";
import { IGeoIPService } from "./interfaces/IGeoIPService";
import { UAParser } from "ua-parser-js";

export class PageViewsService implements IPageViewsService {
  private pageViewRepository: IPageViewsRepository;
  private websiteRepository: IWebsiteRepository;
  private sessionCacheRepository: ISessionCacheRepository;
  private geoIPService: IGeoIPService;

  constructor(
    pageViewRepository: IPageViewsRepository,
    websiteRepository: IWebsiteRepository,
    sessionCacheRepository: ISessionCacheRepository,
    geoIPService: IGeoIPService
  ) {
    this.pageViewRepository = pageViewRepository;
    this.websiteRepository = websiteRepository;
    this.sessionCacheRepository = sessionCacheRepository;
    this.geoIPService = geoIPService;
  }

  static getClientInfo(userAgent: string) {
    const parser = new UAParser(userAgent);

    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const device = parser.getDevice().type || "desktop";

    return {
      browser,
      os,
      device,
    };
  }

  async recordPageView(
    scriptDTO: ScriptDTO
  ): Promise<{ status: string; msg: string }> {
    // 1. Find the site using the site key
    const site = await this.websiteRepository.findByKey(scriptDTO.siteKey);

    if (site === null) {
      throw new Error("INVALID_SITE_KEY");
    }

    const siteId = site.getId();

    // 2. Generate the visitor ID
    const visitorHashID = PageView.generateVisitorId(
      scriptDTO.userAgent,
      scriptDTO.IPAddress
    );

    // 3. Find the visitor ID in the cache database.
    let visitorId = await this.sessionCacheRepository.findVisitorId(
      visitorHashID
    );

    if (visitorId === null) {
      visitorId = await this.sessionCacheRepository.storeVisitorId(
        visitorHashID
      );
    }

    // 4. Get client info.
    const { browser, os, device } = PageViewsService.getClientInfo(
      scriptDTO.userAgent
    );

    // 5. Get country ISO code.
    const countryISOCode = this.geoIPService.getCountry(scriptDTO.IPAddress);

    // 6. Create the pageView entity
    const pageView = new PageView(
      null,
      siteId,
      visitorId,
      scriptDTO.url,
      scriptDTO.referrer,
      device,
      browser,
      os,
      countryISOCode,
      null
    );

    // 7. Save in database.
    await this.pageViewRepository.record(pageView);

    return { status: "ok", msg: "SITE_RECORDED" };
  }

  async getStats(
    websiteId: number,
    userId: number,
    days: number
  ): Promise<Stats> {
    // 1. Check website ID correspond to user.
    const website = await this.websiteRepository.find(websiteId, userId);

    if (website === null) throw new Error("Invalid website ID");

    // 2. fetch unique visitors from the db.
    const uniqueVisitors = await this.pageViewRepository.getUniqueVisitors(
      websiteId,
      days
    );

    // 3. fetch total visits
    const totalPagesViews = await this.pageViewRepository.getTotalViews(
      websiteId,
      days
    );

    // 4. Views per visit
    const viewsPerVisit = totalPagesViews / uniqueVisitors;

    // 5. Bounce Rate
    const singlePageVisits = await this.pageViewRepository.getSinglePageSession(
      websiteId,
      days
    );
    const bounceRate = (singlePageVisits / uniqueVisitors) * 100;

    // 6. Visit duration
    const visitDuration = 0;

    // 7. fetch views by source
    const viewsBySource = await this.pageViewRepository.getViewsBySource(
      websiteId,
      days
    );

    // 8. fetch views by browser
    const viewsByBrowser = await this.pageViewRepository.getViewsByBrowser(
      websiteId,
      days
    );

    // 8. fetch views by country
    const viewsByCountry = await this.pageViewRepository.getViewsByCountry(
      websiteId,
      days
    );

    // 9. fetch views by pageURL
    const viewsByPageURL = await this.pageViewRepository.getViewsByPageURL(
      websiteId,
      days
    );

    // 10. fetch views by device
    const viewsByDevice = await this.pageViewRepository.getViewsByDevice(
      websiteId,
      days
    );

    // 11. fetch views by OS
    const viewsByOS = await this.pageViewRepository.getViewsByOS(
      websiteId,
      days
    );

    return new Stats(
      uniqueVisitors,
      totalPagesViews,
      viewsPerVisit,
      bounceRate,
      visitDuration,
      viewsByPageURL,
      viewsBySource,
      viewsByCountry,
      viewsByBrowser,
      viewsByOS,
      viewsByDevice
    );
  }
}

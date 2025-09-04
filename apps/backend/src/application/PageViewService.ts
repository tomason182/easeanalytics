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
  ): Promise<Stats> {}
}

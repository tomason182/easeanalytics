import { PageViewDTO } from "../../dto/PageViewDTO";
import crypto from "node:crypto";

export class PageView {
  public id: number | null;
  public websiteId: number;
  public visitorId: string;
  public pageUrl: string;
  public referrer: string;
  public deviceType: string;
  public browser: string;
  public os: string;
  public country: string;
  public viewedAt: Date | null;

  constructor(
    id: number | null,
    websiteId: number,
    visitorId: string,
    pageUrl: string,
    referrer: string,
    deviceType: string,
    browser: string,
    os: string,
    country: string,
    viewedAt: Date | null
  ) {
    this.id = id;
    this.websiteId = websiteId;
    this.visitorId = visitorId;
    this.pageUrl = pageUrl;
    this.referrer = referrer;
    this.deviceType = deviceType;
    this.browser = browser;
    this.os = os;
    this.country = country;
    this.viewedAt = viewedAt;
  }

  static fromDTO(data: PageViewDTO): PageView {
    return new PageView(
      data.id,
      data.websiteId,
      data.visitorId,
      data.pageUrl,
      data.referrer,
      data.deviceType,
      data.browser,
      data.os,
      data.country,
      data.viewedAt
    );
  }

  static anonymizeIp(ip: string): string {
    // For IPv4 keep the first 3 octets.
    if (ip.includes(".")) {
      const parts = ip.split(".");
      if (parts.length === 4) {
        parts[3] = "0";
        return parts.join(".");
      }
    }

    if (ip.includes(":")) {
      const blocks = ip.split(":");
      if (blocks.length >= 4) {
        return blocks.slice(0, 4).join(":") + "::";
      }
    }

    return ip; // fallback
  }

  static generateVisitorId(userAgent: string, ip: string) {
    const secretKey = process.env.HASH_SECRET;
    const anonymizedIp = this.anonymizeIp(ip);
    const raw = `${anonymizedIp}|${userAgent}|${secretKey}`;
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  // Getters
  getId(): number {
    if (this.id === null) throw new Error("Pageview id is null");
    return this.id;
  }
  getWebsiteId(): number {
    return this.websiteId;
  }
  getVisitorId(): string {
    return this.visitorId;
  }
  getPageUrl(): string {
    return this.pageUrl;
  }
  getReferrer(): string {
    return this.referrer;
  }
  getDeviceType(): string {
    return this.deviceType;
  }
  getBrowser(): string {
    return this.browser;
  }
  getOS(): string {
    return this.os;
  }
  getCountry(): string {
    return this.country;
  }
  getViewedAt(): Date {
    if (this.viewedAt === null) throw new Error("Viewed at is null");
    return this.viewedAt;
  }
}

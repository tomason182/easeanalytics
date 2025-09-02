import { DeviceType, PageViewDTO } from "../../dto/PageViewDTO";

export class PageView {
  public id: number;
  public websiteId: number;
  public visitorId: string;
  public pageUrl: string;
  public referrer: string;
  public deviceType: DeviceType;
  public browser: string;
  public os: string;
  public country: string;
  public viewedAt: Date;

  constructor(
    id: number,
    websiteId: number,
    visitorId: string,
    pageUrl: string,
    referrer: string,
    deviceType: DeviceType,
    browser: string,
    os: string,
    country: string,
    viewedAt: Date
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

  // Getters
  getId(): number {
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
    return this.viewedAt;
  }
}

export type DeviceType = "desktop" | "mobile" | "tablet";

export interface PageViewsDTO {
  id: number;
  websiteId: number;
  visitorId: string;
  pageUrl: string;
  referrer: string;
  deviceType: DeviceType;
  browser: string;
  os: string;
  country: string;
  viewedAt: Date;
}

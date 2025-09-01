import { RowDataPacket } from "mysql2/promise";
export type DeviceType = "desktop" | "mobile" | "tablet";

export interface PageViewsDTO extends RowDataPacket {
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

export interface totalViews extends RowDataPacket {
  totalViews: number;
}

export interface StatsRows extends RowDataPacket {
  description: string;
  totalViews: number;
}

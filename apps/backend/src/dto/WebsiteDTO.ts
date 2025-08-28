export interface WebsiteDTO {
  id: number;
  userId: number;
  siteName: string;
  siteUrl: string;
  siteKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWebsiteDTO {
  userId: number;
  siteName: string;
  siteUrl: string;
}

export interface UpdateWebsiteDTO {
  id: number;
  userId: number;
  siteName: string;
  siteUrl: string;
}

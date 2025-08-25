import { randomUUID } from "node:crypto";
import { WebsiteDTO } from "../../dto/WebsiteDTO";

export class Website {
  public id: number | null;
  public userId: number;
  public siteName: string;
  public siteUrl: string;
  public siteKey: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: number | null,
    userId: number,
    siteName: string,
    siteUrl: string,
    siteKey: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.siteName = siteName;
    this.siteUrl = siteUrl;
    this.siteKey = siteKey;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Metodos estaticos
  static setSiteKey() {
    return randomUUID();
  }

  static fromDTO(data: WebsiteDTO, options = { setSiteKey: false }): Website {
    const siteKey = options.setSiteKey ? Website.setSiteKey() : data.siteKey;

    return new Website(
      data.id,
      data.userId,
      data.siteName,
      data.siteUrl,
      siteKey,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  getId(): number {
    const id = this.id;
    if (!id) {
      throw new Error("Website id is not defined");
    }
    return id;
  }
  getUserId(): number {
    return this.userId;
  }
  getSiteName(): string {
    return this.siteName;
  }
  getSiteUrl(): string {
    return this.siteUrl;
  }
  getSiteKey(): string {
    const siteKey = this.siteKey;
    if (!siteKey) {
      throw new Error("Website sitekey is not defined");
    }
    return siteKey;
  }
}

import { randomUUID } from "node:crypto";
import {
  CreateWebsiteDTO,
  UpdateWebsiteDTO,
  WebsiteDTO,
} from "../../dto/WebsiteDTO";

export class Website {
  public id: number | null;
  public userId: number;
  public siteName: string;
  public siteUrl: string;
  public siteKey: string;
  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor(
    id: number | null,
    userId: number,
    siteName: string,
    siteUrl: string,
    siteKey: string,
    createdAt: Date | null,
    updatedAt: Date | null
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

  static fromDTO(data: WebsiteDTO): Website {
    const siteKey = data.siteKey;

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

  static fromCreateDTO(data: CreateWebsiteDTO): Website {
    const siteKey = Website.setSiteKey();

    return new Website(
      null,
      data.userId,
      data.siteName,
      data.siteUrl,
      siteKey,
      null,
      null
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
  setSiteName(name: string): void {
    this.siteName = name;
  }
  getSiteName(): string {
    return this.siteName;
  }
  setSiteUrl(url: string): void {
    this.siteUrl = url;
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

import Valkey from "iovalkey";
import { ISessionCacheRepository } from "./interfaces/ISessionCacheRepository";

export class SessionCacheRepository implements ISessionCacheRepository {
  private valkey: Valkey;

  constructor(
    host: string = process.env.VALKEY_HOST || "127.0.0.1",
    port: number = parseInt(process.env.VALKEY_PORT || "6379", 10)
  ) {
    this.valkey = new Valkey(port, host);
  }

  async storeVisitorId(id: string, siteId: number): Promise<string> {
    const key = `session:${id}:${siteId}`;
    await this.valkey.set(key, "active", "EX", 86400);

    return id;
  }

  async findVisitorId(id: string, siteId: number): Promise<string | null> {
    const key = `session:${id}:${siteId}`;

    if ((await this.valkey.exists(key)) > 0) {
      return id;
    } else {
      return null;
    }
  }
}

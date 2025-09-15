export interface ISessionCacheRepository {
  findVisitorId(id: string, siteId: number): Promise<string | null>;

  storeVisitorId(id: string, siteId: number): Promise<string>;
}

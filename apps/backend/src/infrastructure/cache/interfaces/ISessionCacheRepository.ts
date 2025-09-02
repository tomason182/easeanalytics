export interface ISessionCacheRepository {
  findVisitorId(id: string): Promise<number | null>;

  storeVisitorId(id: string): Promise<number>;
}

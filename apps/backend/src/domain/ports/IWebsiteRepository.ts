import { Website } from "../entities/Website";

export interface IWebsiteRepository {
  save(website: Website): Promise<void>;

  find(id: number): Promise<Website | null>;

  findAll(userId: number): Promise<Array<Website>>;

  delete(id: number, userId: number): Promise<void>;

  update(website: Website): Promise<void>;
}

import { WebsiteDTO } from "../../dto/WebsiteDTO";
import { Website } from "../../domain/entities/Website";

export interface IWebsiteService {
  add(website: WebsiteDTO): Promise<{ status: string; msg: string }>;

  update(website: WebsiteDTO): Promise<{ status: string; msg: string }>;

  delete(id: number): Promise<{ status: string; msg: string }>;

  read(id: number): Promise<Website>;
}

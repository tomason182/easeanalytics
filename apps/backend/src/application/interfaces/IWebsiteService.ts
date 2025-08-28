import { CreateWebsiteDTO, UpdateWebsiteDTO } from "../../dto/WebsiteDTO";
import { Website } from "../../domain/entities/Website";

export interface IWebsiteService {
  add(website: CreateWebsiteDTO): Promise<{ status: string; msg: string }>;

  update(website: UpdateWebsiteDTO): Promise<{ status: string; msg: string }>;

  delete(id: number, userId: number): Promise<{ status: string; msg: string }>;

  read(id: number): Promise<Website>;
}

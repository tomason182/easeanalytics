import { IWebsiteRepository } from "../../domain/ports/IWebsiteRepository";
import { Website } from "../../domain/entities/Website";
import { UnitOfWork } from "../transactions/UnitOfWork";
import { WebsiteDTO } from "../../dto/WebsiteDTO";
import { ResultSetHeader } from "mysql2/promise";

export class WebsiteRepositoryMySQL implements IWebsiteRepository {
  private uow: UnitOfWork;

  constructor(uow: UnitOfWork) {
    this.uow = uow;
  }

  async save(website: Website): Promise<void> {
    const conn = await this.uow.getConnection();
    const query =
      "INSERT INTO websites (user_id, site_name, site_url, site_key) VALUES (?,?,?,?)";
    const params = [
      website.getUserId(),
      website.getSiteName(),
      website.getSiteUrl(),
    ];

    const [result] = await conn.execute<ResultSetHeader>(query, params);

    website.setId(result.insertId);
  }

  async find(id: number, userId: number): Promise<Website | null> {
    const conn = await this.uow.getConnection();
    const query = "SELECT * FROM websites WHERE id = ? AND user_id = ? LIMIT 1";
    const [result] = await conn.execute<WebsiteDTO[]>(query, [id, userId]);

    if (result.length === 0) {
      return null;
    }

    const website = Website.fromDTO(result[0]);

    return website;
  }

  async findAll(userId: number): Promise<Array<Website>> {
    const conn = await this.uow.getConnection();
    const query = "SELECT * FROM websites WHERE user_id = ?";

    const [results] = await conn.execute<Array<WebsiteDTO>>(query, [userId]);

    const websiteList = [];
    for (const result of results) {
      const website = Website.fromDTO(result);
      websiteList.push(website);
    }

    return websiteList;
  }

  async findByKey(key: string): Promise<Website | null> {
    const conn = await this.uow.getConnection();
    const query = "SELECT * FROM website WHERE site_key = ?";

    const [result] = await conn.execute<WebsiteDTO[]>(query, [key]);

    if (result.length === 0) return null;

    const website = Website.fromDTO(result[0]);

    return website;
  }

  async delete(id: number, userId: number): Promise<void> {
    const conn = await this.uow.getConnection();
    const query = "DELETE FROM websites WHERE id = ? AND user_id = ?";

    await conn.execute(query, [id, userId]);
  }

  async update(website: Website): Promise<void> {
    const conn = await this.uow.getConnection();
    const query =
      "UPDATE FROM websites SET siteName = ?, siteUrl = ? WHERE id = ? AND user_id = ?";
    const params = [
      website.getSiteName(),
      website.getSiteUrl(),
      website.getId(),
      website.getUserId(),
    ];

    await conn.execute(query, params);
  }
}

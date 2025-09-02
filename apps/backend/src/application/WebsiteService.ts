import { Website } from "../domain/entities/Website";
import { IWebsiteRepository } from "../domain/ports/IWebsiteRepository";
import {
  CreateWebsiteDTO,
  UpdateWebsiteDTO,
  WebsiteDTO,
} from "../dto/WebsiteDTO";
import { IWebsiteService } from "./interfaces/IWebsiteService";

const WEBSITES_TOTAL_AMOUNT = 5;

export class WebsiteService implements IWebsiteService {
  private websiteRepository: IWebsiteRepository;

  constructor(websiteRepository: IWebsiteRepository) {
    this.websiteRepository = websiteRepository;
  }

  async add(
    websiteDTO: CreateWebsiteDTO
  ): Promise<{ status: string; msg: string }> {
    // 1. Check total amount of websites allowed.
    const userWebsitesCount = await this.websiteRepository.findAll(
      websiteDTO.userId
    );

    if (userWebsitesCount.length > WEBSITES_TOTAL_AMOUNT)
      return { status: "error", msg: "MAX_WEBSITES_REACH" };

    // 2. Create website object
    const website = Website.fromCreateDTO(websiteDTO);

    // 3. Save the website in the database
    await this.websiteRepository.save(website);

    return { status: "ok", msg: "WEBSITE_UPDATED" };
  }

  async update(
    updateWebsiteDTO: UpdateWebsiteDTO
  ): Promise<{ status: string; msg: string }> {
    // 1. Find website by id.
    const website = await this.websiteRepository.find(updateWebsiteDTO.id);

    // 2. Verify the userId correspond.
    if (website.getUserId() !== updateWebsiteDTO.userId) {
      throw new Error("INVALID_USER_ID");
    }

    // 3. Update websites values.

    website.setSiteName(updateWebsiteDTO.siteName);
    website.setSiteUrl(updateWebsiteDTO.siteUrl);

    await this.websiteRepository.save(website);

    return { status: "ok", msg: "WEBSITE_UPDATED" };
  }

  async delete(
    id: number,
    userId: number
  ): Promise<{ status: string; msg: string }> {
    await this.websiteRepository.delete(id, userId);

    return { status: "ok", msg: "WEBSITE_DELETED" };
  }

  async read(id: number): Promise<Website> {
    // 1. Find website by id.
    const website = await this.websiteRepository.find(id);

    return website;
  }
}

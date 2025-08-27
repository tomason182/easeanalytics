import { Website } from "../domain/entities/Website";
import { IWebsiteRepository } from "../domain/ports/IWebsiteRepository";
import { WebsiteDTO } from "../dto/WebsiteDTO";
import { IWebsiteService } from "./interfaces/IWebsiteService";

const WEBSITES_TOTAL_AMOUNT = 5;

export class WebsiteService implements IWebsiteService {
  private websiteRepository: IWebsiteRepository;

  constructor(websiteRepository: IWebsiteRepository) {
    this.websiteRepository = websiteRepository;
  }

  async add(websiteDTO: WebsiteDTO): Promise<{ status: string; msg: string }> {
    // 1. Check total amount of websites allowed.
    const userWebsitesCount = await this.websiteRepository.findAll(
      websiteDTO.userId
    );

    if (userWebsitesCount.length > WEBSITES_TOTAL_AMOUNT)
      return { status: "error", msg: "MAX_WEBSITES_REACH" };

    // 2. Create website object
    const website = Website.fromDTO(websiteDTO, { setSiteKey: true });

    // 3. Save the website in the database
    await this.websiteRepository.save(website);

    return { status: "ok", msg: "WEBSITE_UPDATED" };
  }

  async update(
    websiteDTO: WebsiteDTO
  ): Promise<{ status: string; msg: string }> {
    // 1. Find website by id.
    const website = await this.websiteRepository.find(websiteDTO.id);

    // 2. Verify the userId correspond.
    if (website.getUserId() !== websiteDTO.userId) {
      throw new Error("INVALID_USER_ID");
    }

    // 3. Update websites values.
    const updatedWebsite = Website.fromDTO(websiteDTO);

    await this.websiteRepository.save(updatedWebsite);

    return { status: "ok", msg: "WEBSITE_UPDATED" };
  }

  async delete(id: number): Promise<{ status: string; msg: string }> {
    await this.websiteRepository.delete(id);

    return { status: "ok", msg: "WEBSITE_DELETED" };
  }

  async read(id: number): Promise<Website> {
    // 1. Find website by id.
    const website = await this.websiteRepository.find(id);

    return website;
  }
}

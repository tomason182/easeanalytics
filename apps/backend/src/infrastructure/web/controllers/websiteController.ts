import { matchedData } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { IWebsiteService } from "../../../application/interfaces/IWebsiteService";
import { CreateWebsiteDTO, UpdateWebsiteDTO } from "../../../dto/WebsiteDTO";

export class WebsiteController {
  private websiteService: IWebsiteService;

  constructor(websiteService: IWebsiteService) {
    this.websiteService = websiteService;
  }

  async addWebsite(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { siteName, siteUrl } = matchedData(req);

      let userId = null;
      const payload = req.auth;
      if (payload && typeof payload !== "string") {
        userId = payload.id;
      }

      if (!userId) throw new Error("USER_ID_NOT_DEFINED");

      const websiteDTO: CreateWebsiteDTO = {
        userId: userId,
        siteName: siteName,
        siteUrl: siteUrl,
      };

      const result = await this.websiteService.add(websiteDTO);

      return res.status(400).json({ msg: result.msg });
    } catch (err) {
      next(err);
    }
  }

  async updateWebsite(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id, siteName, siteUrl } = matchedData(req);

      let userId = null;
      const payload = req.auth;
      if (payload && typeof payload !== "string") {
        userId = payload.id;
      }

      if (!userId) throw new Error("USER_ID_NOT_DEFINED");

      const website: UpdateWebsiteDTO = {
        id: id,
        userId: userId,
        siteName: siteName,
        siteUrl: siteUrl,
      };

      const result = await this.websiteService.update(website);

      return res.status(200).json({ msg: result.msg });
    } catch (err) {
      next(err);
    }
  }

  async deleteWebsite(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { id } = matchedData(req);

    let userId = null;
    const payload = req.auth;
    if (payload && typeof payload !== "string") {
      userId = payload.id;
    }

    if (!userId) throw new Error("USER_ID_NOT_DEFINED");

    const result = await this.websiteService.delete(id, userId);
  }
}

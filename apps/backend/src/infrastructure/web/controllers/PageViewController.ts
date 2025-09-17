import { matchedData } from "express-validator";
import { IPageViewsService } from "../../../application/interfaces/IPageViewsService";
import { Request, Response, NextFunction } from "express";
import { ScriptDTO } from "../../../dto/ScriptDTO";

export class PageViewController {
  private pageViewService: IPageViewsService;

  constructor(pageViewService: IPageViewsService) {
    this.pageViewService = pageViewService;
  }

  async recordPage(req: Request, res: Response): Promise<Response> {
    try {
      const { siteKey, url, referrer, deviceWith, userAgent, ipAddress } =
        matchedData(req);

      const scriptDTO: ScriptDTO = {
        siteKey,
        url,
        referrer,
        deviceWith,
        userAgent,
        ipAddress,
      };

      const result = await this.pageViewService.recordPageView(scriptDTO);

      return res.status(200).json(result);
    } catch (err) {
      let errorMessage = "UNKNOWN_ERROR";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      return res.status(400).json({ msg: errorMessage });
    }
  }

  async getStats(req: Request, res: Response): Promise<Response> {
    try {
      const { websiteId, days } = matchedData(req);

      let userId = null;
      const payload = req.auth;
      if (payload && typeof payload !== "string") {
        userId = parseInt(payload.id);
      }

      if (!userId) throw new Error("USER_ID_NOT_DEFINED");

      const result = await this.pageViewService.getStats(
        websiteId,
        userId,
        days
      );

      return res.status(200).json(result);
    } catch (err) {
      let errorMessage = "UNKNOWN_ERROR";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      return res.status(400).json({ msg: errorMessage });
    }
  }
}

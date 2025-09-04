import { PageViewDTO } from "../../dto/PageViewDTO";
import { ScriptDTO } from "../../dto/ScriptDTO";
import { PageView } from "../../domain/entities/PageView";
import { Stats } from "../../domain/entities/Stats";

export interface IPageViewsService {
  recordPageView(
    scriptDTO: ScriptDTO
  ): Promise<{ status: string; msg: string }>;

  getStats(websiteId: number, userId: number, days: number): Promise<Stats>;
}

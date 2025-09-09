import { StatsRows } from "../../dto/PageViewDTO";

export class Stats {
  public uniqueVisitors: number;
  public totalPageViews: number;
  public viewsPerVisit: number;
  public bounceRate: number;
  public visitDuration: number;
  public topPages: Array<StatsRows>;
  public topSource: Array<StatsRows>;
  public countries: Array<StatsRows>;
  public browsers: Array<StatsRows>;
  public oses: Array<StatsRows>;
  public devices: Array<StatsRows>;

  constructor(
    uniqueVisitors: number,
    totalPageViews: number,
    viewsPerVisit: number,
    bounceRate: number,
    visitDuration: number,
    topPages: Array<StatsRows>,
    topSource: Array<StatsRows>,
    countries: Array<StatsRows>,
    browsers: Array<StatsRows>,
    oses: Array<StatsRows>,
    devices: Array<StatsRows>
  ) {
    this.uniqueVisitors = uniqueVisitors;
    this.totalPageViews = totalPageViews;
    this.viewsPerVisit = viewsPerVisit;
    this.bounceRate = bounceRate;
    this.visitDuration = visitDuration;
    this.topPages = topPages;
    this.topSource = topSource;
    this.countries = countries;
    this.browsers = browsers;
    this.oses = oses;
    this.devices = devices;
  }
}

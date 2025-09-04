import maxmind, { CountryResponse, Reader } from "maxmind";

export class GeoIPService {
  private dbPath: string;
  private lookup: Reader<CountryResponse> | null = null;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  async init() {
    this.lookup = await maxmind.open<CountryResponse>(this.dbPath);
  }

  getCountry(ip: string): string {
    if (!this.lookup) throw new Error("GeoIP database not initialized");

    const result = this.lookup.get(ip);

    return result?.country?.iso_code || "N/A";
  }
}

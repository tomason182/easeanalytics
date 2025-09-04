export interface IGeoIPService {
  init(): Promise<void>;
  getCountry(ip: string): string;
}

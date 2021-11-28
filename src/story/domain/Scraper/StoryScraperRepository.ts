import { StoryScraper } from "./StoryScraper";

export interface StoryScraperRepository {
  getScraperByUrl(url: string): StoryScraper;
  getScraperByName(name: string): StoryScraper;
}

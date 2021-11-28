import { StoryScraper } from "../../domain/Scraper/StoryScraper";
import { map } from "lodash";
import { TruyenfullStoryScraper } from "./TruyenfullStoryScraper";
import { Injectable } from "../../../Shared/domain/AppContainer";
import { StoryScraperRepository } from "../../domain/Scraper/StoryScraperRepository";
import { BoygiasStoryScraper } from "./BoygiasStoryScraper";

@Injectable()
export class MemoryStoryScraperRepository implements StoryScraperRepository {
  private scraperMapping: Record<string, StoryScraper> = {};
  constructor(
    truyenfullScraper: TruyenfullStoryScraper,
    boygiasScraper: BoygiasStoryScraper,
  ) {
    this.scraperMapping["truyenfull"] = truyenfullScraper;
    this.scraperMapping["boygias"] = boygiasScraper;
  }

  getScraperByUrl(url: string): StoryScraper {
    let result: StoryScraper | null = null;
    map(this.scraperMapping, (scraper, name: string) => {
      if (url.indexOf(name) > 0) {
        result = scraper;
      }
    });

    if (!result) {
      throw new Error("Not found scraper by url");
    }
    return result;
  }

  getScraperByName(name: string): StoryScraper {
    if (!this.scraperMapping[name]) {
      throw new Error("Not found scraper");
    }
    return this.scraperMapping[name];
  }
}

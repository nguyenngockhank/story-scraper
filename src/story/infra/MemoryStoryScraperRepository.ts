import { StoryScraper } from "../domain/Scraper/StoryScraper";
import { TruyenfullStoryScraper } from "./Scraper/TruyenfullStoryScraper";
import { Injectable } from "../../Shared/domain/AppContainer";
import { StoryScraperRepository } from "../domain/Scraper/StoryScraperRepository";
import { BoygiasStoryScraper } from "./Scraper/BoygiasStoryScraper";
import { SstruyenStoryScraper } from "./Scraper/SstruyenStoryScraper";
import { TienhiepStoryScraper } from "./Scraper/TienhiepStoryScraper";
import { DtruyenStoryScraper } from "./Scraper/DtruyenStoryScraper";
import { BachngocsachStoryScraper } from "./Scraper/BachngocsachStoryScraper";
import { map } from "../../Shared/domain/lodash";

@Injectable()
export class MemoryStoryScraperRepository implements StoryScraperRepository {
  private scraperMapping: Record<string, StoryScraper> = {};
  constructor(
    truyenfullScraper: TruyenfullStoryScraper,
    boygiasScraper: BoygiasStoryScraper,
    sstruyenScraper: SstruyenStoryScraper,
    tienhiepScraper: TienhiepStoryScraper,
    dtruyenScraper: DtruyenStoryScraper,
    bachngocsachStoryScraper: BachngocsachStoryScraper,
  ) {
    this.scraperMapping["truyenfull"] = truyenfullScraper;
    this.scraperMapping["boygias"] = boygiasScraper;
    this.scraperMapping["sstruyen"] = sstruyenScraper;
    this.scraperMapping["tienhiep"] = tienhiepScraper;
    this.scraperMapping["dtruyen"] = dtruyenScraper;
    this.scraperMapping["bachngocsach"] = bachngocsachStoryScraper;
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
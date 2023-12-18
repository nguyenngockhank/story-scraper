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
import { Tienhiep2StoryScraper } from "./Scraper/Tienhiep2StoryScraper";
import { ThichTienHiepStoryScraper } from "./Scraper/ThichTienHiepStoryScraper";
import { TangThuVienStoryScraper } from "./Scraper/TangThuVienStoryScraper";
import { MetruyenchuStoryScraper } from "./Scraper/MetruyenchuStoryScraper";
import { TruyenmoiStoryScraper } from "./Scraper/TruyenmoiStoryScraper";
import { TruyenchuScraper } from "./Scraper/TruyenchuScraper";

export enum SourceProvider {
  truyenfull = "https://truyenfull.vn/",
  boygias = "https://boygias.com",
  sstruyen = "https://sstruyen.com",
  tienhiep = "https://tienhiep.net",
  dtruyen = "https://dtruyen.com",
  thichtienhiep = "https://thichtienhiep.com",
  tangthuvien = "https://truyen.tangthuvien.vn",
  bachngocsach = "https://bachngocsach.com.vn/",
  truyenmoi = "https://truyenmoi.org",
  truyenchu = "https://truyenchu.vn",
}

@Injectable()
export class MemoryStoryScraperRepository implements StoryScraperRepository {
  private scraperMapping: Record<string, StoryScraper> = {};

  constructor(
    truyenfullScraper: TruyenfullStoryScraper,
    boygiasScraper: BoygiasStoryScraper,
    sstruyenScraper: SstruyenStoryScraper,
    tienhiepScraper: TienhiepStoryScraper,
    tienhiep2Scraper: Tienhiep2StoryScraper,
    dtruyenScraper: DtruyenStoryScraper,
    bachngocsachStoryScraper: BachngocsachStoryScraper,
    thichTienHiepStoryScraper: ThichTienHiepStoryScraper,
    tangThuVienStoryScraper: TangThuVienStoryScraper,
    metruyenchuStoryScraper: MetruyenchuStoryScraper,
    truyenmoiStoryScraper: TruyenmoiStoryScraper,
    truyenchuScraper: TruyenchuScraper,
  ) {
    this.scraperMapping["truyenfull"] = truyenfullScraper;
    this.scraperMapping["boygias"] = boygiasScraper;
    this.scraperMapping["sstruyen"] = sstruyenScraper;
    this.scraperMapping["tienhiep"] = tienhiepScraper;
    this.scraperMapping["tienhiep2"] = tienhiep2Scraper;
    this.scraperMapping["dtruyen"] = dtruyenScraper;
    this.scraperMapping["bachngocsach"] = bachngocsachStoryScraper;
    this.scraperMapping["thichtienhiep"] = thichTienHiepStoryScraper;
    this.scraperMapping["tangthuvien"] = tangThuVienStoryScraper;
    this.scraperMapping["metruyenchu"] = metruyenchuStoryScraper;
    this.scraperMapping["truyenmoi"] = truyenmoiStoryScraper;
    this.scraperMapping["truyenchu"] = truyenchuScraper;
  }

  getScraperByUrl(url: string): StoryScraper {
    let result: StoryScraper | null = null;
    map(this.scraperMapping, (scraper: StoryScraper, name: string) => {
      if (url.indexOf(name) > 0) {
        result = scraper;
      }
    });

    if (!result) {
      throw new Error("Not found scraper by url[" + url + "]");
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

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
import { MetruyencvStoryScraper } from "./Scraper/MetruyencvStoryScraper";
import { TruyenmoiStoryScraper } from "./Scraper/TruyenmoiStoryScraper";
import { TruyenchuScraper } from "./Scraper/TruyenchuScraper";
import { Truyen35Scraper } from "./Scraper/Truyen35Scraper";
import { DoctruyenchufulXyzScraper } from "./Scraper/DoctruyenchufulXyzScraper";
import { TruyenfullComStoryScraper } from "./Scraper/TruyenfullComStoryScraper";

export enum SourceProvider {
  truyenfull = "https://truyenfull.vn/",
  boygias = "https://boygias.com",
  sstruyen = "https://sstruyen.com",
  tienhiep = "https://tienhiep.net",
  dtruyen = "https://dtruyen.com",
  thichtienhiep = "https://thichtienhiep.com",
  tangthuvien = "https://truyen.tangthuvien.vn",
  bachngocsach = "https://bachngocsach.com.vn",
  truyenmoi = "https://truyenmoi.org",
  truyenchu = "https://truyenchu.vn",
  doctruyenchufulxyz = "https://doctruyenchufull.live",
  truyenfullcom = "https://truyenfull.com",
  metruyencv = "https://metruyencv.com",
}

@Injectable()
export class MemoryStoryScraperRepository implements StoryScraperRepository {
  private scraperMapping: Record<string, StoryScraper> = {};

  constructor(
    truyenfullScraper: TruyenfullStoryScraper,
    truyenfullComScraper: TruyenfullComStoryScraper,
    truyen35Scraper: Truyen35Scraper,
    boygiasScraper: BoygiasStoryScraper,
    doctruyenchufulXyzScraper: DoctruyenchufulXyzScraper,
    sstruyenScraper: SstruyenStoryScraper,
    tienhiepScraper: TienhiepStoryScraper,
    tienhiep2Scraper: Tienhiep2StoryScraper,
    dtruyenScraper: DtruyenStoryScraper,
    bachngocsachStoryScraper: BachngocsachStoryScraper,
    thichTienHiepStoryScraper: ThichTienHiepStoryScraper,
    tangThuVienStoryScraper: TangThuVienStoryScraper,
    metruyencvStoryScraper: MetruyencvStoryScraper,
    truyenmoiStoryScraper: TruyenmoiStoryScraper,
    truyenchuScraper: TruyenchuScraper,
  ) {
    this.scraperMapping["truyenfullcom"] = truyenfullComScraper;
    this.scraperMapping["doctruyenchufulxyz"] = doctruyenchufulXyzScraper;
    this.scraperMapping["truyenfull"] = truyenfullScraper;
    this.scraperMapping["boygias"] = boygiasScraper;
    this.scraperMapping["sstruyen"] = sstruyenScraper;
    this.scraperMapping["tienhiep"] = tienhiepScraper;
    this.scraperMapping["tienhiep2"] = tienhiep2Scraper;
    this.scraperMapping["dtruyen"] = dtruyenScraper;
    this.scraperMapping["bachngocsach"] = bachngocsachStoryScraper;
    this.scraperMapping["thichtienhiep"] = thichTienHiepStoryScraper;
    this.scraperMapping["tangthuvien"] = tangThuVienStoryScraper;
    this.scraperMapping["metruyencv"] = metruyencvStoryScraper;
    this.scraperMapping["truyenmoi"] = truyenmoiStoryScraper;
    this.scraperMapping["truyenchu"] = truyenchuScraper;
    this.scraperMapping["truyen35"] = truyen35Scraper;
  }

  getScraperByUrl(url: string): StoryScraper {
    let result: StoryScraper | null = null;
    map(this.scraperMapping, (scraper: StoryScraper) => {
      if (url.includes(scraper.options.baseUrl)) {
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

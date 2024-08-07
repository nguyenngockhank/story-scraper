import { Module } from "@nestjs/common";
import { NedbStoryRepository } from "./NedbStoryRepository";
import { storyItems } from "../domain/StoryContainer";
import { TruyenfullStoryScraper } from "./Scraper/TruyenfullStoryScraper";
import { MemoryStoryScraperRepository } from "./MemoryStoryScraperRepository";
import { ScrapeStoryByProviderUseCase } from "../use-cases/ScrapeStoryByProviderUseCase";
import { StoryController } from "./story.controller";
import { BoygiasStoryScraper } from "./Scraper/BoygiasStoryScraper";
import { ScrapeStoryByUrlUseCase } from "../use-cases/ScrapeStoryByUrlUseCase";
import { SstruyenStoryScraper } from "./Scraper/SstruyenStoryScraper";
import { TienhiepStoryScraper } from "./Scraper/TienhiepStoryScraper";
import { Tienhiep2StoryScraper } from "./Scraper/Tienhiep2StoryScraper";
import { DtruyenStoryScraper } from "./Scraper/DtruyenStoryScraper";
import { BachngocsachStoryScraper } from "./Scraper/BachngocsachStoryScraper";
import { ThichTienHiepStoryScraper } from "./Scraper/ThichTienHiepStoryScraper";
import { TangThuVienStoryScraper } from "./Scraper/TangThuVienStoryScraper";
import { MetruyencvStoryScraper } from "./Scraper/MetruyencvStoryScraper";
import { TruyenmoiStoryScraper } from "./Scraper/TruyenmoiStoryScraper";
import { TruyenchuScraper } from "./Scraper/TruyenchuScraper";
import { Truyen35Scraper } from "./Scraper/Truyen35Scraper";
import { DoctruyenchufulXyzScraper } from "./Scraper/DoctruyenchufulXyzScraper";
import { TruyenfullComStoryScraper } from "./Scraper/TruyenfullComStoryScraper";

@Module({
  controllers: [StoryController],
  providers: [
    {
      provide: storyItems.StoryRepository,
      useClass: NedbStoryRepository,
    },
    // story scraper
    TruyenfullStoryScraper,
    TruyenfullComStoryScraper,
    TruyenmoiStoryScraper,
    TruyenchuScraper,
    SstruyenStoryScraper,
    BoygiasStoryScraper,
    TienhiepStoryScraper,
    Tienhiep2StoryScraper,
    DtruyenStoryScraper,
    BachngocsachStoryScraper,
    ThichTienHiepStoryScraper,
    TangThuVienStoryScraper,
    Truyen35Scraper,
    DoctruyenchufulXyzScraper,
    {
      provide: storyItems.StoryScraperRepository,
      useClass: MemoryStoryScraperRepository,
    },
    ScrapeStoryByProviderUseCase,
    ScrapeStoryByUrlUseCase,
    MetruyencvStoryScraper,
  ],
  exports: [
    {
      provide: storyItems.StoryRepository,
      useClass: NedbStoryRepository,
    },
  ],
})
export class StoryModule {}

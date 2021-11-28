import { Module } from "@nestjs/common";
import { NedbStoryRepository } from "./NedbStoryRepository";
import { storyItems } from "../domain/StoryContainer";
import { TruyenfullStoryScraper } from "./Scraper/TruyenfullStoryScraper";
import { MemoryStoryScraperRepository } from "./Scraper/MemoryStoryScraperRepository";
import { ScrapeStoryByProviderUseCase } from "../use-cases/ScrapeStoryByProviderUseCase";
import { StoryController } from "./story.controller";
import { BoygiasStoryScraper } from "./Scraper/BoygiasStoryScraper";
import { ScrapeStoryByUrlUseCase } from "../use-cases/ScrapeStoryByUrlUseCase";
import { SstruyenStoryScraper } from "./Scraper/SstruyenStoryScraper";

@Module({
  controllers: [StoryController],
  providers: [
    {
      provide: storyItems.StoryRepository,
      useClass: NedbStoryRepository,
    },
    // story scraper
    TruyenfullStoryScraper,
    SstruyenStoryScraper,
    BoygiasStoryScraper,
    {
      provide: storyItems.StoryScraperRepository,
      useClass: MemoryStoryScraperRepository,
    },
    ScrapeStoryByProviderUseCase,
    ScrapeStoryByUrlUseCase,
  ],
  exports: [
    {
      provide: storyItems.StoryRepository,
      useClass: NedbStoryRepository,
    },
  ],
})
export class StoryModule {}

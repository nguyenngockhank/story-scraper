import { Module } from "@nestjs/common";
import { PostsLatestGetUseCase } from "../use-cases/PostsLatestGetUseCase";
import { FootballController } from "./football.controller";
import { NedbPostRepository } from "./PostRepository/NedbPostRepository";
import { Twenty4hPostScraper } from "./PostScraper/Twenty4hPostScraper";
import { VnexpressPostScraper } from "./PostScraper/VnexpressPostScraper";
import { PostScraperList } from "../domain/PostScraper";
import { PostsLatestScrapeUseCase } from "../use-cases/PostsLatestScrapeUseCase";
import { footballItems } from "../domain/FootballContainer";

@Module({
  controllers: [FootballController],
  providers: [
    // use cases
    PostsLatestGetUseCase,
    PostsLatestScrapeUseCase,
    // infra
    Twenty4hPostScraper,
    VnexpressPostScraper,
    {
      provide: footballItems.PostRepository,
      useClass: NedbPostRepository,
    },
    {
      provide: footballItems.ScraperList,
      useFactory(
        vnexpressScraper: VnexpressPostScraper,
        twenty4hPostScraper: Twenty4hPostScraper,
      ): PostScraperList {
        return [vnexpressScraper, twenty4hPostScraper];
      },
      inject: [VnexpressPostScraper, Twenty4hPostScraper],
    },
  ],
})
export class FootballModule {}

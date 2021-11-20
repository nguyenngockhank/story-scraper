import { Controller, Get } from "@nestjs/common";
import { PostsLatestGetUseCase } from "../use-cases/PostsLatestGetUseCase";
import { PostsLatestScrapeUseCase } from "../use-cases/PostsLatestScrapeUseCase";

@Controller()
export class FootballController {
  constructor(
    private postsLatestGetUC: PostsLatestGetUseCase,
    private postsLatestScrape: PostsLatestScrapeUseCase,
  ) {}

  @Get("football/news")
  getLatestNews() {
    return this.postsLatestGetUC.execute();
  }

  @Get("football/news/scrape")
  scrapeLatestNews() {
    return this.postsLatestScrape.execute();
  }
}

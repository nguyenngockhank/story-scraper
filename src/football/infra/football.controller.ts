import { Controller, Get, Inject, Render } from "@nestjs/common";
import { PostRepository } from "../domain/PostRepository";
import { footballItems } from "../domain/FootballContainer";
import { PostsLatestGetUseCase } from "../use-cases/PostsLatestGetUseCase";
import { PostsLatestScrapeUseCase } from "../use-cases/PostsLatestScrapeUseCase";

@Controller()
export class FootballController {
  constructor(
    private postsLatestGetUC: PostsLatestGetUseCase,
    private postsLatestScrapeUC: PostsLatestScrapeUseCase,

    @Inject(footballItems.PostRepository)
    private postRepo: PostRepository,
  ) {}

  @Get("api/football/news")
  getLatestNews() {
    return this.postsLatestGetUC.execute();
  }

  @Get("api/football/news/scrape")
  scrapeLatestNews() {
    return this.postsLatestScrapeUC.execute();
  }

  @Get("football/news")
  @Render("index")
  async viewNews() {
    const posts = await this.postsLatestGetUC.execute();
    return { posts };
  }
}

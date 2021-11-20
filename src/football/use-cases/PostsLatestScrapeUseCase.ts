import { Injectable, Inject } from "../../shared/domain/AppContainer";
import { footballItems } from "../domain/FootballContainer";
import { BriefPost } from "../domain/Post";
import { PostRepository } from "../domain/PostRepository";
import { PostScraper, PostScraperList } from "../domain/PostScraper";

@Injectable()
export class PostsLatestScrapeUseCase {
  constructor(
    @Inject(footballItems.ScraperList)
    private scraperList: PostScraperList,

    @Inject(footballItems.PostRepository)
    private postRepo: PostRepository,
  ) {}

  async execute(): Promise<BriefPost[]> {
    const result = [];
    for (const scraper of this.scraperList) {
      const posts = await this.executeScraper(scraper);
      result.push(...posts);
    }
    return result;
  }

  private async executeScraper(scraper: PostScraper): Promise<BriefPost[]> {
    const posts = await scraper.fetchLatestNews();
    await this.postRepo.storeBriefPosts(posts);
    return posts;
  }
}

import { Inject } from "../../Shared/domain/AppContainer";
import { StoryScraperRepository } from "../domain/Scraper/StoryScraperRepository";
import { storyItems } from "../domain/StoryContainer";

export class ScrapeStoryByProviderUseCase {
  constructor(
    @Inject(storyItems.StoryScraperRepository)
    private scraperRepo: StoryScraperRepository,
  ) {}
  async execute(
    provider: string,
    story: string,
    metadata?: Record<string, string>,
  ): Promise<void> {
    const scraper = this.scraperRepo.getScraperByName(provider);
    await scraper.fetchChapters(story, metadata);
    await scraper.fetchChapterContents(story, metadata);
  }
}

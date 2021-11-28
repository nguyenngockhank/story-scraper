import { Inject } from "../../Shared/domain/AppContainer";
import { StoryScraperRepository } from "../domain/Scraper/StoryScraperRepository";
import { storyItems } from "../domain/StoryContainer";

export class ScrapeStoryUseCase {
  constructor(
    @Inject(storyItems.StoryScraperRepository)
    private scraperRepo: StoryScraperRepository,
  ) {}
  async execute(provider: string, story: string): Promise<void> {
    const scraper = this.scraperRepo.getScraperByName(provider);
    await scraper.fetchChapters(story);
    await scraper.fetchChapterContents(story);
  }
}

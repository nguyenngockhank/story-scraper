import { Inject } from "../../Shared/domain/AppContainer";
import { StoryScraperRepository } from "../domain/Scraper/StoryScraperRepository";
import { storyItems } from "../domain/StoryContainer";

export class ScrapeStoryByUrlUseCase {
  constructor(
    @Inject(storyItems.StoryScraperRepository)
    private scraperRepo: StoryScraperRepository,
  ) {}
  async execute(url: string): Promise<void> {
    const scraper = this.scraperRepo.getScraperByUrl(url);
    const story = scraper.extractStory(url);
    const metaData = scraper.extractStoryMetadata(url);

    await scraper.fetchChapters(story, metaData);
    await scraper.fetchChapterContents(story, metaData);
  }
}

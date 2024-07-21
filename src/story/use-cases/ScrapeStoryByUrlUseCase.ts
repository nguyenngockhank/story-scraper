import { Inject } from "../../Shared/domain/AppContainer";
import { StoryScraperRepository } from "../domain/Scraper/StoryScraperRepository";
import { storyItems } from "../domain/StoryContainer";

export class ScrapeStoryByUrlUseCase {
  constructor(
    @Inject(storyItems.StoryScraperRepository)
    private scraperRepo: StoryScraperRepository,
  ) {}
  async execute(
    url: string,
    storyMetadata: Record<string, any>,
  ): Promise<void> {
    const scraper = this.scraperRepo.getScraperByUrl(url);

    const story = scraper.extractStory(url);

    const builtMetaData = await scraper.fetchStoryMetadata(url);

    console.log("STARTED scrape story :", {
      url,
      builtMetaData,
      story,
    });

    await scraper.fetchChapters(story, { ...builtMetaData, ...storyMetadata });
    await scraper.fetchChapterContents(story, builtMetaData);
  }
}

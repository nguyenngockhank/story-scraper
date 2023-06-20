import { Controller, Post, Body } from "@nestjs/common";
import { ScrapeStoryByUrlUseCase } from "../use-cases/ScrapeStoryByUrlUseCase";
import { ScrapeStoryByProviderUseCase } from "../use-cases/ScrapeStoryByProviderUseCase";

@Controller()
export class StoryController {
  constructor(
    private scrapeStoryByProviderUC: ScrapeStoryByProviderUseCase,
    private scrapeStoryByUrlUC: ScrapeStoryByUrlUseCase,
  ) {}

  @Post("api/story/scrape")
  scrapeStory(
    @Body()
    payload: {
      story: string;
      provider: string;
      url: string;
      metadata: Record<string, string>;
    },
  ) {
    if (payload.url) {
      return this.scrapeStoryByUrlUC.execute(payload.url);
    }

    return this.scrapeStoryByProviderUC.execute(
      payload.provider,
      payload.story,
      payload.metadata,
    );
  }
}

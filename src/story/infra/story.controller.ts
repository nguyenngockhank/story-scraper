import { Controller, Post, Body } from "@nestjs/common";
import { ScrapeStoryUseCase } from "../use-cases/ScrapeStoryUseCase";

@Controller()
export class StoryController {
  constructor(private scrapeStoryUseCase: ScrapeStoryUseCase) {}

  @Post("api/story/scrape")
  scrapeStory(@Body() payload: { story: string; provider: string }) {
    return this.scrapeStoryUseCase.execute(payload.provider, payload.story);
  }
}

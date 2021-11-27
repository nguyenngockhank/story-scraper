import { Controller, Post, Body } from "@nestjs/common";
import { EpubToMp3UseCase } from "../use-cases/EpubToMp3UseCase";
import { EpubToStoryUseCase } from "../use-cases/EpubToStoryUseCase";
import { StoryToMp3UseCase } from "../use-cases/StoryToMp3UseCase";

@Controller()
export class TransformerController {
  constructor(
    private epubToStoryUC: EpubToStoryUseCase,
    private storyToMp3UC: StoryToMp3UseCase,
    private epubToMp3UC: EpubToMp3UseCase,
  ) {}

  @Post("api/transformer/epub-to-story")
  epubToStory(@Body() payload: { inputFile: string }) {
    return this.epubToStoryUC.execute(payload.inputFile);
  }

  @Post("api/transformer/story-to-mp3")
  storyToMp3(@Body() payload: { story: string }) {
    return this.storyToMp3UC.execute(payload.story);
  }

  @Post("api/transformer/epub-to-mp3")
  epubToMp3(@Body() payload: { inputFile: string }) {
    return this.epubToMp3UC.execute(payload.inputFile);
  }
}

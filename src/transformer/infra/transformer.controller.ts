import { Controller, Post, Body } from "@nestjs/common";
import { EpubToStoryUseCase } from "../use-cases/EpubToStoryUseCase";

@Controller()
export class TransformerController {
  constructor(private epubToStoryUseCase: EpubToStoryUseCase) {}

  @Post("api/transformer/epub-to-story")
  epubToStory(@Body() payload: { inputFile: string }) {
    return this.epubToStoryUseCase.execute(payload.inputFile);
  }
}

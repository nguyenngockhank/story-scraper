import { Injectable } from "../../Shared/domain/AppContainer";
import { EpubToStoryUseCase } from "./EpubToStoryUseCase";
import { StoryToMp3UseCase } from "./StoryToMp3UseCase";

@Injectable()
export class EpubToMp3UseCase {
  constructor(
    private epubToStoryUC: EpubToStoryUseCase,
    private storyToMp3UC: StoryToMp3UseCase,
  ) {}

  async execute(inputFile: string): Promise<string[]> {
    const story = await this.epubToStoryUC.execute(inputFile);
    return this.storyToMp3UC.execute(story);
  }
}

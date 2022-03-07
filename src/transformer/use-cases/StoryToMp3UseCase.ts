import { Injectable, Inject } from "../../Shared/domain/AppContainer";
import { Transformer } from "../domain/Transformer";
import { transformerItems } from "../domain/TransformerContainer";

@Injectable()
export class StoryToMp3UseCase {
  constructor(
    @Inject(transformerItems.Transformer)
    private transformer: Transformer,
  ) {}

  async execute(
    story: string,
    fromChapter = 1,
    tempo?: number,
    splitPerFolder?: number,
  ): Promise<string[]> {
    console.log("STARTED process story to mp3:", {
      fromChapter,
      story,
      tempo,
      splitPerFolder,
    });
    const result = await this.transformer.storyToMp3(story, {
      fromChapter,
      tempo,
      splitPerFolder,
    });
    console.log("ENDED process story to mp3", story);
    return result;
  }
}

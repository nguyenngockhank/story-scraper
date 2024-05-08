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
    options: {
      fromChapter: number;
      toChapter?: number;
      tempo?: number;
      splitPerFolder?: number;
    },
  ): Promise<string[]> {
    const { fromChapter, toChapter, tempo, splitPerFolder } = options;

    console.log("STARTED process story to mp3:", {
      fromChapter,
      toChapter,
      story,
      tempo,
      splitPerFolder,
    });

    const result = await this.transformer.storyToMp3(story, {
      fromChapter,
      toChapter,
      tempo,
      splitPerFolder,
    });
    console.log("ENDED process story to mp3", story);
    return result;
  }
}

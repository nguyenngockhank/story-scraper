import { Injectable, Inject } from "../../Shared/domain/AppContainer";
import { Transformer } from "../domain/Transformer";
import { transformerItems } from "../domain/TransformerContainer";

@Injectable()
export class StoryToMp3UseCase {
  constructor(
    @Inject(transformerItems.Transformer)
    private transformer: Transformer,
  ) {}

  async execute(story: string, fromChapter = 1): Promise<string[]> {
    console.log("process story to mp3 ", story, " fromChapter ", fromChapter);
    const result = await this.transformer.storyToMp3(story, fromChapter);
    console.log("ended process story to mp3", story);
    return result;
  }
}

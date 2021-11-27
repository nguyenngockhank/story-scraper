import { Injectable, Inject } from "../../shared/domain/AppContainer";
import { Transformer } from "../domain/Transformer";
import { transformerItems } from "../domain/TransformerContainer";

@Injectable()
export class StoryToMp3UseCase {
  constructor(
    @Inject(transformerItems.Transformer)
    private transformer: Transformer,
  ) {}

  execute(story: string, fromChapter = 1): Promise<string[]> {
    console.log("process story to mp3 ", story, " fromChapter ", fromChapter);
    return this.transformer.storyToMp3(story, fromChapter);
  }
}

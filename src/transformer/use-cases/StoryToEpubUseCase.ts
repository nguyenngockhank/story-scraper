import { Injectable, Inject } from "../../Shared/domain/AppContainer";
import { Transformer } from "../domain/Transformer";
import { transformerItems } from "../domain/TransformerContainer";

@Injectable()
export class StoryToEpubUseCase {
  constructor(
    @Inject(transformerItems.Transformer)
    private transformer: Transformer,
  ) {}

  async execute(story: string, chapterPerFile?: number): Promise<string[]> {
    console.log("STARTED process story to epub:", { story, chapterPerFile });
    const result = await this.transformer.storyToEpub(story, {
      chapPerFile: chapterPerFile,
    });
    console.log("ENDED process story to epub", { story, chapterPerFile });
    return result;
  }
}

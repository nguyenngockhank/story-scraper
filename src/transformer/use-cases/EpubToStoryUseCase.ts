import { Injectable, Inject } from "../../shared/domain/AppContainer";
import { Transformer } from "../domain/Transformer";
import { transformerItems } from "../domain/TransformerContainer";

@Injectable()
export class EpubToStoryUseCase {
  constructor(
    @Inject(transformerItems.Transformer)
    private transformer: Transformer,
  ) {}

  execute(inputFile: string): Promise<string> {
    return this.transformer.epubToStory(inputFile);
  }
}

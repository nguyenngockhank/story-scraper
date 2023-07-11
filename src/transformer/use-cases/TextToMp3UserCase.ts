import { Injectable, Inject } from "../../Shared/domain/AppContainer";
import { Transformer } from "../domain/Transformer";
import { transformerItems } from "../domain/TransformerContainer";

@Injectable()
export class TextToMp3UserCase {
  constructor(
    @Inject(transformerItems.Transformer)
    private transformer: Transformer,
  ) {}

  async execute(text: string, tempo?: number, lang?: string): Promise<string> {
    console.log("STARTED process text to mp3:", {
      length: text,
      tempo,
      lang,
    });

    const result = await this.transformer.textToMp3(text, {
      tempo,
      lang,
    });

    console.log("ENDED process text to mp3:", {
      text,
      tempo,
      lang,
    });
    return result;
  }
}

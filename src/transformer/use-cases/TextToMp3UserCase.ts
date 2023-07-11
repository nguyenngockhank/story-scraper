import { Injectable, Inject } from "../../Shared/domain/AppContainer";
import { words } from "../../Shared/domain/lodash";
import { Transformer } from "../domain/Transformer";
import { transformerItems } from "../domain/TransformerContainer";

@Injectable()
export class TextToMp3UserCase {
  constructor(
    @Inject(transformerItems.Transformer)
    private transformer: Transformer,
  ) {}

  async execute(
    text: string,
    options: { lang?: string; fileName?: string },
  ): Promise<string> {
    console.log("STARTED process text to mp3:", {
      length: text.length,
      ...options,
    });

    const fileName = options.fileName || this.buildFilename(text);
    const result = await this.transformer.textToMp3(text, {
      fileName,
      lang: options.lang,
    });

    console.log("ENDED process text to mp3:", {
      text,
      ...options,
      fileName,
    });
    return result;
  }

  private buildFilename(content: string): string {
    const listWords = words(content);
    const maxLength = Math.min(listWords.length, 3);
    listWords.length = maxLength;
    const fileName = `${listWords.join("-")}-${new Date().getTime()}.mp3`;
    return fileName;
  }
}

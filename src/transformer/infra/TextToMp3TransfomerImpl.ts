import * as googleTTS from "google-tts-api";
import { Finder } from "../../shared/domain/Finder";
import {
  OutputOptions,
  TextToMp3Transfomer,
} from "../domain/TextToMp3Transfomer";
import { convert } from "html-to-text";
import { Mp3Processor } from "../domain/Mp3Processor";
import { Downloader } from "../../shared/domain/Downloader";

type ConvertDir = { outputDir: string; tempDir: string };
export class TextToMp3TransfomerImpl implements TextToMp3Transfomer {
  constructor(
    private finder: Finder,
    private mp3Processor: Mp3Processor,
    private downloader: Downloader,
  ) {}
  async convert(htmlText: string, outputOptions: OutputOptions): Promise<void> {
    const outputFile = this.finder.build(
      outputOptions.outputDir,
      outputOptions.fileName,
    );
    if (this.finder.exists(outputFile)) {
      throw new Error("Outfile: " + outputFile + " exists!");
    }

    const { tempDir } = this.prepareDirs(outputOptions);
    const content = this.filterContent(htmlText);

    const audioItems = await googleTTS
      .getAllAudioUrls(content, {
        lang: outputOptions.lang || "vi",
        slow: false,
      })
      .map((item, i) => {
        return {
          ...item,
          output: this.finder.build(tempDir, `${i}.mp3`),
        };
      });

    await this.downloader.downloadItems(audioItems);

    await this.mp3Processor.merge(
      audioItems.map((item) => item.output),
      outputFile,
    );

    await this.finder.deleteDir(tempDir);
  }

  private prepareDirs({ outputDir }: OutputOptions): ConvertDir {
    const tempDir = this.finder.build(outputDir, "temp");

    this.finder.createDir(outputDir);
    this.finder.createDir(tempDir);

    return {
      outputDir,
      tempDir,
    };
  }

  private filterContent(htmlText: string): string {
    return convert(htmlText, {
      ignoreImage: true,
      wordwrap: 150,
    });
  }
}

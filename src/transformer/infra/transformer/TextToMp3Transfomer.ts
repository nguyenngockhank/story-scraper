import * as googleTTS from "google-tts-api";
import { Finder } from "../../../Shared/domain/Finder";
import { convert } from "html-to-text";
import { Mp3Processor } from "../../../Shared/domain/Mp3Processor";
import { Downloader, DownloadedItem } from "../../../Shared/domain/Downloader";

type ConvertDir = { outputDir: string; tempDir: string };

export type OutputOptions = {
  fileName: string;
  outputDir: string;
  lang: string;
  tempo?: number;
};
export class TextToMp3Transfomer {
  constructor(
    private finder: Finder,
    private mp3Processor: Mp3Processor,
    private downloader: Downloader,
  ) {}
  async execute(htmlText: string, options: OutputOptions): Promise<void> {
    const outputFile = this.finder.build(options.outputDir, options.fileName);
    if (this.finder.exists(outputFile)) {
      throw new Error("Outfile: " + outputFile + " exists!");
    }

    const { tempDir } = this.prepareDirs(options);
    const content = this.filterContent(htmlText);

    const downloadedItems = await this.downloadItems(content, {
      tempDir,
      lang: options.lang,
    });

    if (downloadedItems.length === 0) {
      return;
    }

    await this.downloader.downloadItems(downloadedItems);

    await this.mp3Processor.merge(
      downloadedItems.map((item) => item.output),
      outputFile,
      options.tempo,
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
    const str = convert(htmlText, {
      ignoreImage: true,
      wordwrap: 150,
    });

    const [first] = str.split(
      "Team chúng mình biết quảng cáo Popup sẽ khiến Quý đọc giả khó chịu khi trải nghiệm",
    );

    const urlTrimed = first.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
    return urlTrimed;
  }

  private async downloadItems(
    content: string,
    options: { tempDir: string; lang: string },
  ): Promise<DownloadedItem[]> {
    try {
      const result = await googleTTS
        .getAllAudioUrls(content, {
          lang: options.lang,
          slow: false,
        })
        .map((item, i) => {
          return {
            ...item,
            output: this.finder.build(options.tempDir, `${i}.mp3`),
          };
        });
      return result;
    } catch (err) {
      console.warn(err);
      return [];
    }
  }
}

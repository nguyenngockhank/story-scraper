import * as googleTTS from "google-tts-api";
import { Finder } from "../../../Shared/domain/Finder";
import { convert } from "html-to-text";
import { Mp3Processor } from "../../../Shared/domain/Mp3Processor";
import { Downloader, DownloadItem } from "../../../Shared/domain/Downloader";

type ConvertDir = { outputDir: string; tempDir: string };

export type OutputOptions = {
  fileName: string;
  outputDir: string;
  lang?: string;
};
export class TextToMp3Transfomer {
  constructor(
    private finder: Finder,
    private mp3Processor: Mp3Processor,
    private downloader: Downloader,
  ) {}
  async execute(htmlText: string, outputOptions: OutputOptions): Promise<void> {
    const outputFile = this.finder.build(
      outputOptions.outputDir,
      outputOptions.fileName,
    );
    if (this.finder.exists(outputFile)) {
      throw new Error("Outfile: " + outputFile + " exists!");
    }

    const { tempDir } = this.prepareDirs(outputOptions);
    const content = this.filterContent(htmlText);

    const downloadItems = await this.buildDownloadItems(content, {
      tempDir,
      lang: outputOptions.lang || "vi",
    });

    if (downloadItems.length === 0) {
      return;
    }

    await this.downloader.downloadItems(downloadItems);

    await this.mp3Processor.merge(
      downloadItems.map((item) => item.output),
      outputFile,
      2,
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

  private async buildDownloadItems(
    content: string,
    options: { tempDir: string; lang: string },
  ): Promise<DownloadItem[]> {
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

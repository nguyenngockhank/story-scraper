import { chunk, first, last, sortBy } from "../../../Shared/domain/lodash";
import { StoryRepository } from "../../../Story/domain/StoryRepository";
import { FileName, StoryToEpubOptions } from "../../domain/Transformer";
import { Chapter as DomainChapter } from "../../../Story/domain/Chapter";
import { ChapterContent } from "../../../Story/domain/ChapterContent";
import { Options, EPub, Chapter } from "epub-gen-memory";
import { Finder } from "../../../Shared/domain/Finder";

export class StoryToEpubTransformer {
  constructor(private storyRepo: StoryRepository, private finder: Finder) {}
  async execute(
    storyName: string,
    options?: StoryToEpubOptions,
  ): Promise<FileName[]> {
    const chapPerFile = options.chapPerFile > 0 ? options.chapPerFile : 100;
    const chapters = await this.storyRepo.getChapterList(storyName);

    const chapBatches = chunk(sortBy(chapters, "index"), chapPerFile);

    this.finder.createDir(`epub/${storyName}`);
    const result: FileName[] = [];
    for (const batch of chapBatches) {
      const buffer = await this.genEpubFile(storyName, batch);
      const destFile = this.finder.build(
        `epub`,
        storyName,
        this.buildEpubTitle(storyName, batch) + ".epub",
      );
      this.finder.writeFile(destFile, buffer);
      result.push(destFile);
    }

    return result;
  }

  private buildEpubTitle(storyName: string, chapters: DomainChapter[]): string {
    const firstChap = first(chapters);
    const lastChap = last(chapters);
    return `${storyName} (${firstChap.index} - ${lastChap.index})`;
  }

  private async genEpubFile(
    storyName: string,
    chapters: DomainChapter[],
  ): Promise<Buffer> {
    const chapDtos = await this.readChapContents(storyName, chapters);
    const chapOptions = chapDtos.map(({ title, content }): Chapter => {
      return {
        title: title,
        content: content,
      };
    });
    const epubOptions: Options = {
      title: this.buildEpubTitle(storyName, chapters),
    };
    const epub = new EPub(epubOptions, chapOptions);
    return epub.genEpub();
  }

  private async readChapContents(
    storyName: string,
    chapters: DomainChapter[],
  ): Promise<ChapterContent[]> {
    return Promise.all(
      chapters.map((chap) =>
        this.storyRepo.getChapterContent(storyName, chap.index),
      ),
    );
  }
}

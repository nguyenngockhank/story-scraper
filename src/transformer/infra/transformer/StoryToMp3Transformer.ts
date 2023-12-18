import { Finder } from "../../../Shared/domain/Finder";
import { StoryRepository } from "../../../Story/domain/StoryRepository";
import { FileName, StoryToMp3Options } from "../../domain/Transformer";
import { TextToMp3Transfomer } from "./TextToMp3Transfomer";

export class StoryToMp3Transformer {
  constructor(
    private storyRepo: StoryRepository,
    private finder: Finder,
    private textToMp3Transformer: TextToMp3Transfomer,
  ) {}

  async execute(
    story: string,
    options?: StoryToMp3Options,
  ): Promise<FileName[]> {
    const fromChapter = options.fromChapter || 1;
    const toChapter = options.toChapter || Number.MAX_SAFE_INTEGER;
    const tempo = options.tempo || 1;
    const lang = options.lang || "vi";

    const chapters = await this.storyRepo.getChapterList(story);
    const processChapters = chapters.filter(
      (c) => c.index >= fromChapter && c.index <= toChapter,
    );

    if (processChapters.length === 0) {
      throw new Error("No chapters found!");
    }

    const result: FileName[] = [];
    for (const chapter of processChapters) {
      const { index } = chapter;
      const chapterContent = await this.storyRepo.getChapterContent(
        story,
        index,
      );

      const html = chapterContent.content;

      const storedPath = this.buildStoredFolder(story, index, options);
      await this.textToMp3Transformer.execute(html, {
        fileName: `${index}.mp3`,
        outputDir: storedPath,
        tempo,
        lang,
      });

      result.push(this.finder.build(storedPath, `${index}.mp3`));
    }

    return result;
  }

  private buildStoredFolder(
    story: string,
    chapIndex: number,
    options?: StoryToMp3Options,
  ): string {
    const splitPerFolder = options.splitPerFolder;
    if (!splitPerFolder) {
      return `audio/${story}`;
    }

    const t = Math.floor(chapIndex / splitPerFolder) + 1;
    const folderIndex = t * splitPerFolder;

    return `audio/${story}/${folderIndex}`;
  }
}

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
    const tempo = options.tempo || 1;

    const chapters = await this.storyRepo.getChapterList(story);
    const processChapters = chapters.filter((c) => c.index >= fromChapter);

    if (processChapters.length === 0) {
      throw new Error("No chapters found!");
    }

    const result: FileName[] = [];
    for (const chapter of processChapters) {
      const chapterContent = await this.storyRepo.getChapterContent(
        story,
        chapter.index,
      );

      const html = chapterContent.content;
      await this.textToMp3Transformer.execute(html, {
        fileName: `${chapter.index}.mp3`,
        outputDir: `audio/${story}`,
        tempo,
      });

      result.push(this.finder.build(`audio/${story}`, `${chapter.index}.mp3`));
    }

    return result;
  }
}

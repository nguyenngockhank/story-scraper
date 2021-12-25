import {
  appItems,
  Inject,
  Injectable,
} from "../../../Shared/domain/AppContainer";
import { Finder } from "../../../Shared/domain/Finder";
import { storyItems } from "../../../Story/domain/StoryContainer";
import { Story, StoryRepository } from "../../../Story/domain/StoryRepository";
import { EpubReader } from "../../domain/EpubReader";
import { Mp3Processor } from "../../../Shared/domain/Mp3Processor";
import { FileName, Transformer } from "../../domain/Transformer";
import { transformerItems } from "../../domain/TransformerContainer";
import { TextToMp3Transfomer } from "./TextToMp3Transfomer";
import { Downloader } from "../../../Shared/domain/Downloader";

@Injectable()
export class TransformerImpl implements Transformer {
  private textToMp3Transformer: TextToMp3Transfomer;
  constructor(
    private finder: Finder,

    @Inject(transformerItems.EpubReader)
    private epubReader: EpubReader,

    @Inject(appItems.Mp3Processor)
    private mp3Processor: Mp3Processor,

    @Inject(storyItems.StoryRepository)
    private storyRepo: StoryRepository,
    @Inject(appItems.Downloader)
    private downloader: Downloader,
  ) {
    this.textToMp3Transformer = new TextToMp3Transfomer(
      this.finder,
      this.mp3Processor,
      this.downloader,
    );
  }

  async epubToStory(inputFile: string): Promise<Story> {
    if (!this.finder.exists(inputFile)) {
      throw new Error("File not found!");
    }
    const storyDetail = await this.epubReader.getStoryDetail(inputFile);
    const { story, chapters, chapterContents } = storyDetail;

    await this.storyRepo.saveChapterList(story, chapters);
    await Promise.all(
      chapterContents.map((chapterContent) =>
        this.storyRepo.saveChapterContent(story, chapterContent),
      ),
    );
    return story;
  }
  async storyToMp3(
    story: string,
    fromChapter = 1,
    tempo?: number,
  ): Promise<FileName[]> {
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
  textToMp3(text: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

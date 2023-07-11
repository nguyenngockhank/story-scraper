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
import {
  FileName,
  StoryToEpubOptions,
  StoryToMp3Options,
  TextToMp3Options,
  Transformer,
} from "../../domain/Transformer";
import { transformerItems } from "../../domain/TransformerContainer";
import { TextToMp3Transfomer } from "./TextToMp3Transfomer";
import { Downloader } from "../../../Shared/domain/Downloader";
import { StoryToMp3Transformer } from "./StoryToMp3Transformer";
import { StoryToEpubTransformer } from "./StoryToEpubTransformer";
import { words } from "../../../Shared/domain/lodash";

@Injectable()
export class TransformerImpl implements Transformer {
  private textToMp3Transformer: TextToMp3Transfomer;
  private storyToMp3Transformer: StoryToMp3Transformer;
  private storyToEpubTransformer: StoryToEpubTransformer;
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
    this.storyToMp3Transformer = new StoryToMp3Transformer(
      this.storyRepo,
      this.finder,
      this.textToMp3Transformer,
    );
    this.storyToEpubTransformer = new StoryToEpubTransformer(
      this.storyRepo,
      this.finder,
    );
  }
  storyToEpub(
    storyName: string,
    options?: StoryToEpubOptions,
  ): Promise<string[]> {
    return this.storyToEpubTransformer.execute(storyName, options);
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
    options?: StoryToMp3Options,
  ): Promise<FileName[]> {
    return this.storyToMp3Transformer.execute(story, options);
  }

  async textToMp3(text: string, options: TextToMp3Options): Promise<FileName> {
    const fileName = options.fileName;
    const outputDir = `audio/text/`;

    await this.textToMp3Transformer.execute(text, {
      outputDir,
      fileName,
      lang: options.lang || "en",
      ...options,
    });

    return outputDir + fileName;
  }
}

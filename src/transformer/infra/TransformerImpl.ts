import { Inject, Injectable } from "../../shared/domain/AppContainer";
import { Finder } from "../../shared/domain/Finder";
import { storyItems } from "../../story/domain/StoryContainer";
import { Story, StoryRepository } from "../../story/domain/StoryRepository";
import { EpubReader } from "../domain/EpubReader";
import { Mp3File, Transformer } from "../domain/Transformer";
import { transformerItems } from "../domain/TransformerContainer";

@Injectable()
export class TransformerImpl implements Transformer {
  constructor(
    private finder: Finder,

    @Inject(transformerItems.EpubReader)
    private epubReader: EpubReader,

    @Inject(storyItems.StoryRepository)
    private storyRepo: StoryRepository,
  ) {}

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
  storyToMp3(story: string): Promise<Mp3File[]> {
    throw new Error("Method not implemented.");
  }
  textToMp3(text: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

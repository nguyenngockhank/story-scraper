import { Chapter } from "../../Story/domain/Chapter";
import { ChapterContent } from "../../Story/domain/ChapterContent";
import { Story } from "../../Story/domain/StoryRepository";

export type StoryDetail = {
  story: Story;
  chapters: Chapter[];
  chapterContents: ChapterContent[];
};

export interface EpubReader {
  getStoryDetail(inputFile: string): Promise<StoryDetail>;
}

import { Chapter } from "../../story/domain/Chapter";
import { ChapterContent } from "../../story/domain/ChapterContent";
import { Story } from "../../story/domain/StoryRepository";

export type StoryDetail = {
  story: Story;
  chapters: Chapter[];
  chapterContents: ChapterContent[];
};

export interface EpubReader {
  getStoryDetail(inputFile: string): Promise<StoryDetail>;
}

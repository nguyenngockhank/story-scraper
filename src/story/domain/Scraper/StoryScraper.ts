import { Chapter } from "../Chapter";
import { ChapterContent } from "../ChapterContent";
import { Story } from "../StoryRepository";

export interface StoryScraper {
  fetchChapters(story: string): Promise<Chapter[]>;
  fetchChapterContents(story: Story): Promise<ChapterContent[]>;
}

import { Chapter } from "./Chapter";
import { ChapterContent } from "./ChapterContent";

export type Story = string;

export interface StoryRepository {
  isStoryExists(story: Story | string): Promise<boolean>;

  getChapterList(story: Story): Promise<Chapter[]>;

  getChapterContent(
    story: Story,
    index: number | string,
  ): Promise<ChapterContent>;

  saveChapterList(story: Story, chapters: Chapter[]): Promise<void>;

  saveChapterContent(
    story: Story,
    chapterContent: ChapterContent,
  ): Promise<void>;
}

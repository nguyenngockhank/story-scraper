import { Chapter } from "../Chapter";
import { ChapterContent } from "../ChapterContent";
import { Story } from "../StoryRepository";

export type StoryMetaData = {
  storyId?: string;
  storySlug?: string;
  maxChapter?: number;
  token?: string;
};

export interface StoryScraper {
  fetchChapters(story: string, metadata?: StoryMetaData): Promise<Chapter[]>;
  fetchChapterContents(
    story: Story,
    metadata?: StoryMetaData,
  ): Promise<ChapterContent[]>;

  extractStory(url: string): string;
  fetchStoryMetadata(url: string): Promise<StoryMetaData>;
}

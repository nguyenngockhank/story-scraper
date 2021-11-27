import { Story } from "../../Story/domain/StoryRepository";

export type OutputOptions = {
  fileName: string;
  outputDir: string;
  lang?: string;
};

export type FileName = string;
export interface Transformer {
  epubToStory(inputFile: string): Promise<Story>;

  // storyToMp3(story: Story): Promise<Mp3File[]>;

  storyToMp3(story: Story, fromChapter?: number): Promise<FileName[]>;

  textToMp3(text: string): Promise<void>;
}

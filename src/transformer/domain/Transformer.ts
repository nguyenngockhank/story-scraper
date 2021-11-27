import { Story } from "../../story/domain/StoryRepository";

export type OutputOptions = {
  fileName: string;
  outputDir: string;
  lang?: string;
};

export type Mp3File = {
  fileName: string;
};

export interface Transformer {
  epubToStory(inputFile: string): Promise<Story>;

  storyToMp3(story: Story): Promise<Mp3File[]>;

  textToMp3(text: string): Promise<void>;
}

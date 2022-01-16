import { Story } from "../../Story/domain/StoryRepository";

export type FileName = string;

export type StoryToMp3Options = {
  fromChapter?: number;
  tempo?: number;
};

export interface Transformer {
  epubToStory(inputFile: string): Promise<Story>;

  storyToEpub(storyName: string): Promise<FileName[]>;

  storyToMp3(story: Story, options?: StoryToMp3Options): Promise<FileName[]>;

  textToMp3(text: string): Promise<void>;
}

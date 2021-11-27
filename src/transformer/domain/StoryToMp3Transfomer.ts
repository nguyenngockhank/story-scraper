export type ChapterContent = {
  index: number;
  title?: string;
  content: string;
};

export interface EpubReader {
  getChapters(): Promise<ChapterContent[]>;
}

export type OutputMp3Files = {
  files: string[];
};
export interface EpubToMp3Transfomer {
  execute(inputPath: string): Promise<OutputMp3Files>;
}

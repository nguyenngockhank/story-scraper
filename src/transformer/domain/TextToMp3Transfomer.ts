export type OutputOptions = {
  fileName: string;
  outputDir: string;
  lang?: string;
};

export interface TextToMp3Transfomer {
  convert(text: string, outputOptions: OutputOptions): Promise<void>;
}

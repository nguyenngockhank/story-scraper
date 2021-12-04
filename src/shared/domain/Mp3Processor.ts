export interface Mp3Processor {
  merge(list: string[], outputFile: string, tempo?: number): Promise<string>;

  increaseTempo(
    inputFile: string,
    outputFile: string,
    tempo: number,
  ): Promise<boolean>;
}

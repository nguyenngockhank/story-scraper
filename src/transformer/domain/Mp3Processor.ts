export interface Mp3Processor {
  merge(list: string[], outputFile: string): Promise<string>;
}

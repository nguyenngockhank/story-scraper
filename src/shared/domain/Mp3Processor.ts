export interface Mp3Processor {
  createFromHtml(html: string, outputFile: string): Promise<string>;
  merge(list: string[], outputFile: string): Promise<string>;
}

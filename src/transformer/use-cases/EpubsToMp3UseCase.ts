import { Injectable } from "../../Shared/domain/AppContainer";
import { EpubToMp3UseCase } from "./EpubToMp3UseCase";

@Injectable()
export class EpubsToMp3UseCase {
  constructor(private epubToMp3UC: EpubToMp3UseCase) {}

  async execute(inputFiles: string[]): Promise<string[]> {
    const result = [];
    for (const inputFile of inputFiles) {
      await this.epubToMp3UC.execute(inputFile);
      result.push(inputFile);
    }
    return result;
  }
}

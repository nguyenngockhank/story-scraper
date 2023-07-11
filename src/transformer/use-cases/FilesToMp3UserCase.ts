import { Injectable } from "../../Shared/domain/AppContainer";
import { FileToMp3UserCase } from "./FileToMp3UserCase";

@Injectable()
export class FilesToMp3UserCase {
  constructor(private fileToMp3UserCase: FileToMp3UserCase) {}

  async execute(
    files: Express.Multer.File[],
    lang?: string,
  ): Promise<string[]> {
    const result: string[] = [];
    for (const file of files) {
      const outFile = await this.fileToMp3UserCase.execute(file, lang);
      result.push(outFile);
    }
    return result;
  }
}

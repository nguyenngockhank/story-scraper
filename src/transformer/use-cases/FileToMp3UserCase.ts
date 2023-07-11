import { Injectable } from "../../Shared/domain/AppContainer";
import { Finder } from "../../Shared/domain/Finder";
import { TextToMp3UserCase } from "./TextToMp3UserCase";
import * as path from "path";

@Injectable()
export class FileToMp3UserCase {
  constructor(
    private finder: Finder,
    private textToMp3UserCase: TextToMp3UserCase,
  ) {}

  async execute(file: Express.Multer.File, lang?: string): Promise<string> {
    const filePath = file.path;

    console.log("STARTED process file to mp3:", {
      filePath,
      lang,
    });
    const content = this.finder.readFile(filePath);

    const result = await this.textToMp3UserCase.execute(content, {
      fileName: file.originalname,
      lang,
    });
    this.finder.deleteFile(filePath);

    console.log("ENDED process file to mp3:", {
      filePath,
      lang,
    });
    return result;
  }
}

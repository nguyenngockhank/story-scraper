import { Injectable } from "../../Shared/domain/AppContainer";
import { Finder } from "../../Shared/domain/Finder";

@Injectable()
export class GetFilesUseCase {
  constructor(private finder: Finder) {}

  async execute(
    dir: string,
    keyword: string,
    extension: string,
    recursive: boolean,
  ): Promise<string[]> {
    if (!this.finder.exists(dir)) {
      throw new Error("Dir not exists");
    }
    const files = this.finder.getFiles(dir, extension, recursive);
    if (keyword) {
      return files.filter((file) => file.includes(keyword));
    }
    return files;
  }
}

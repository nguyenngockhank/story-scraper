import * as fs from "fs";
import * as path from "path";

export type File = fs.Dirent;

export class Finder {
  build(...args: string[]): string {
    return path.join(...args);
  }
  exists(path: string): boolean {
    return fs.existsSync(path);
  }
  readDir(path: string): File[] {
    const dirents = fs.readdirSync(path, { withFileTypes: true });
    return dirents;
  }

  createDir(path: string): void {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {
        recursive: true,
      });
    }
  }

  deleteDir(path: string): void {
    fs.rmdirSync(path, { recursive: true });
  }
}

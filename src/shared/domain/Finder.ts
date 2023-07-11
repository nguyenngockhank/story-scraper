import * as fs from "fs";
import * as path from "path";

export type File = fs.Dirent;

export type GetFilesOptions = {
  extension: string;
};

export class Finder {
  deleteFile(filePath: string): void {
    fs.unlinkSync(filePath);
  }

  writeFile(filePath: string, buffer: Buffer): void {
    fs.writeFileSync(filePath, buffer);
  }

  readFile(filePath: string): string {
    return fs.readFileSync(filePath, { encoding: "utf-8" });
  }

  build(...args: string[]): string {
    return path.join(...args);
  }
  exists(dir: string): boolean {
    return fs.existsSync(dir);
  }

  getFiles(dir: string, extension?: string, recursive?: boolean): string[] {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });

    const files: string[] = [];
    if (!recursive) {
      files.push(...dirents.map((dirent) => path.resolve(dir, dirent.name)));
    } else {
      dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory()
          ? files.push(...this.getFiles(res, extension, true))
          : files.push(res);
      });
    }

    if (extension) {
      return files.filter((f) => f.endsWith(`.${extension}`));
    }

    return files;
  }

  readDir(path: string): File[] {
    const dirents = fs.readdirSync(path, { withFileTypes: true });
    return dirents;
  }

  createDir(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
  }

  deleteDir(dir: string): void {
    fs.rmdirSync(dir, { recursive: true });
  }

  fileName(filePath: string, withExt = true): string {
    const baseName = path.basename(filePath);
    if (withExt) {
      return baseName;
    }
    return baseName.split(".").slice(0, -1).join(".");
  }
  dirName(filePath: string): string {
    return path.dirname(filePath);
  }
}

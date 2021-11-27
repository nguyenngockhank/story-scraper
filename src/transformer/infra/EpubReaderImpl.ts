import * as EPub from "epub";
import * as slug from "slug";
import { Chapter } from "../../Story/domain/Chapter";
import { ChapterContent } from "../../Story/domain/ChapterContent";
import { EpubReader, StoryDetail } from "../domain/EpubReader";

export class EpubReaderImpl implements EpubReader {
  getStoryDetail(inputFile: string): Promise<StoryDetail> {
    console.log(inputFile, "INPUT FILE");
    const epub = new EPub(inputFile);

    return new Promise((resolve) => {
      epub.on("end", async () => {
        const story = this.getEpubTitle(epub);
        const chapters: Chapter[] = epub.spine.contents.map((chap, index) => ({
          index,
          url: "#",
          title: chap.title,
          _id: `${chap.id}_${index}`,
        }));

        const chapterContents = await Promise.all(
          chapters.map(async (chapter): Promise<ChapterContent> => {
            const { index } = chapter;
            const content = await this.getEpubContent(
              epub,
              epub.spine.contents[index].id,
            );
            return { ...chapter, content };
          }),
        );

        // console.log(`>>> story: ${story}\nnode build/storyToMp3 ${story} 1`);
        resolve({
          story,
          chapters,
          chapterContents,
        });
      });

      epub.parse();
    });
  }

  private getEpubTitle(epub: EPub): string {
    const { title } = epub.metadata;
    const story = slug(title);
    return story;
  }

  private async getEpubContent(epub: EPub, chapterId: string): Promise<string> {
    return new Promise((resolve) => {
      epub.getChapterRaw(chapterId, (err, txt) => {
        resolve(txt);
      });
    });
  }
}

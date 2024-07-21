import { Finder } from "../../../Shared/domain/Finder";
import { StoryRepository } from "../../../Story/domain/StoryRepository";
import { FileName, StoryToMp3Options } from "../../domain/Transformer";
import { TextToMp3Transfomer } from "./TextToMp3Transfomer";

import { convert } from "html-to-text";

type ChapterToMp3Context = {
  index: number;
  chapterHtml: string;
  nextChapterHtml: string | null;
};

export class StoryToMp3Transformer {
  constructor(
    private storyRepo: StoryRepository,
    private finder: Finder,
    private textToMp3Transformer: TextToMp3Transfomer,
  ) {}

  async execute(
    story: string,
    options?: StoryToMp3Options,
  ): Promise<FileName[]> {
    const fromChapter = options.fromChapter || 1;
    const toChapter = options.toChapter || Number.MAX_SAFE_INTEGER;
    const tempo = options.tempo || 1;
    const lang = options.lang || "vi";

    const chapters = await this.storyRepo.getChapterList(story);
    const processChapters = chapters.filter(
      (c) => c.index >= fromChapter && c.index <= toChapter,
    );

    if (processChapters.length === 0) {
      throw new Error("No chapters found!");
    }

    const result: FileName[] = [];
    for (const chapter of processChapters) {
      const { index } = chapter;
      const [currentChapter, nextChapter] = await Promise.all([
        this.storyRepo.getChapterContent(story, index),
        this.storyRepo.getChapterContent(story, index + 1),
      ]);

      const context: ChapterToMp3Context = {
        index,
        chapterHtml: currentChapter.content,
        nextChapterHtml: nextChapter.content || null,
      };
      // NOTE: filter html
      const text = filterContent(context);

      const storedPath = this.buildStoredFolder(story, index, options);
      await this.textToMp3Transformer.execute(text, {
        fileName: `${index}.mp3`,
        outputDir: storedPath,
        tempo,
        lang,
      });

      result.push(this.finder.build(storedPath, `${index}.mp3`));
    }

    return result;
  }

  private buildStoredFolder(
    story: string,
    chapIndex: number,
    options?: StoryToMp3Options,
  ): string {
    const splitPerFolder = options.splitPerFolder;
    if (!splitPerFolder) {
      return `audio/${story}`;
    }

    const t = Math.floor(chapIndex / splitPerFolder) + 1;
    const folderIndex = t * splitPerFolder;

    return `audio/${story}/${folderIndex}`;
  }
}

const DUPLICATE_DETECTED_LENGTH = 100;

function filterContent({
  chapterHtml,
  nextChapterHtml,
}: ChapterToMp3Context): string {
  let chapterText = htmlToText(chapterHtml);
  if (!nextChapterHtml) {
    return chapterText;
  }

  const nextChapterText = htmlToText(nextChapterHtml);
  let runNext = false;
  do {
    const commonStr = longestCommonSubstring(chapterText, nextChapterText);
    runNext = commonStr.length >= DUPLICATE_DETECTED_LENGTH;
    if (runNext) {
      chapterText = chapterText.replace(commonStr, "");
      console.log(">>> detect duplicated text", commonStr);
    }
  } while (runNext);

  return chapterText;
}

function htmlToText(str: string) {
  return new String(convert(str, { wordwrap: 150, ignoreImage: true }))
    .replace(/ {2,}/g, " ")
    .trim();
}

const longestCommonSubstring = (str1, str2, minLen = 1) => {
  let best = { len: 0, off1: null, off2: null };

  for (let off1 = 0; off1 < str1.length - minLen; off1++) {
    for (let off2 = 0; off2 < str2.length - minLen; off2++) {
      // Holds the number of characters that match
      const maxLen = Math.min(str1.length - off1, str2.length - off2);
      let len = 0;
      while (len < maxLen && str1[off1 + len] === str2[off2 + len]) len++;

      // Store this result if it's the best yet
      if (len > best.len) best = { len, off1, off2 };
    }
  }

  // We can now assert that str1.slice(best.off1, best.len) === str2.slice(best.off2, best.len)
  return best.len >= minLen ? str1.slice(best.off1, best.off1 + best.len) : "";
};

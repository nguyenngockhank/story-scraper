import { WrappedNode } from "../../../../Shared/domain/Scraper";
import { Chapter } from "../../../domain/Chapter";
import { ChapterContent } from "../../../domain/ChapterContent";
import { ScraperContext } from "./CoreTypes";

export type ContentFilter = (
  rawContent: string,
  $content: WrappedNode,
) => string;

export async function scrapeChapterContent(
  { scraper, options }: ScraperContext,
  chapter: Chapter,
  filters?: {
    content?: ContentFilter;
  },
): Promise<ChapterContent> {
  const $ = await scraper.fetchWrappedDOM(chapter.url);
  let content = $(options.selectors.chapterContent).html()?.trim();

  if (filters.content) {
    content = filters.content(content, $(content));
  }

  return {
    ...chapter,
    content,
  };
}

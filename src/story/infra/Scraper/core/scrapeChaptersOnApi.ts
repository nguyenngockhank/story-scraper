import { WrappedDOM, WrappedNode } from "../../../../Shared/domain/Scraper";
import { Chapter } from "../../../domain/Chapter";
import { ScraperContext, ChapterWithoutIndex } from "./CoreTypes";

export type NodeToChapterCallback = (
  context: ScraperContext,
  $el: WrappedNode,
) => ChapterWithoutIndex;

export type BuildChaptersFromPageCallback = (
  context: ScraperContext,
  $: WrappedDOM | string,
) => ChapterWithoutIndex[];

export type BuildChapterPageUrlCallback = (
  context: ScraperContext,
  pageIndex: number,
) => string | Promise<string>;

export type ScraperCallbacks = {
  buildChapterPage: BuildChapterPageUrlCallback;
  toChapters: (context: ScraperContext, jsonData: any) => ChapterWithoutIndex[];
};

export async function scrapeChaptersOnApi(
  context: ScraperContext,
  callbacks: ScraperCallbacks,
): Promise<Chapter[]> {
  const { scraper, options } = context;
  // start scraping
  const chapterListUrl = await callbacks.buildChapterPage(context, 0);
  const data = await scraper.fetch(chapterListUrl, {
    retryAttempt: 1,
  });

  const jsonData = typeof data === "string" ? JSON.parse(data) : data;
  console.log(jsonData);
  const result: ChapterWithoutIndex[] = callbacks.toChapters(context, jsonData);

  // enrich index
  let chapterIndex = 1;
  const chapters = result.map((c) => ({
    ...c,
    index: chapterIndex++,
  }));

  console.log(">> chapters length: ", chapters.length);

  return chapters;
}

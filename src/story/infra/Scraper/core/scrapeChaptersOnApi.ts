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
  const { options } = context;

  const allChapters: ChapterWithoutIndex[] = [];
  for (let index = 1; true; index++) {
    const chapters = await scrapeOnPageIndex(context, callbacks, index);
    allChapters.push(...chapters);
    if (
      chapters.length < options.maxChaptersPerPage ||
      !options.maxChaptersPerPage
    ) {
      break;
    }
  }

  // enrich index
  let chapterIndex = 1;
  const result = allChapters.map((c) => ({
    ...c,
    index: chapterIndex++,
  }));

  console.log(">> chapters length: ", result.length);
  return result;
}

async function scrapeOnPageIndex(
  context: ScraperContext,
  callbacks: ScraperCallbacks,
  pageIndex: number,
): Promise<ChapterWithoutIndex[]> {
  const { scraper } = context;
  const chapterListUrl = await callbacks.buildChapterPage(context, pageIndex);
  const data = await scraper.fetch(chapterListUrl, {
    retryAttempt: 3,
  });

  const jsonData = typeof data === "string" ? JSON.parse(data) : data;
  const result: ChapterWithoutIndex[] = callbacks.toChapters(context, jsonData);
  return result;
}

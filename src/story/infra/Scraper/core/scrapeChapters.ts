import { intersectionBy } from "../../../../Shared/domain/lodash";
import { WrappedDOM, WrappedNode } from "../../../../Shared/domain/Scraper";
import { Chapter } from "../../../domain/Chapter";
import {
  ScraperContext,
  ChapterWithoutIndex,
  ScraperOptions,
} from "./CoreTypes";

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
  nodeToChapter?: NodeToChapterCallback;
  buildChaptersFromPage?: BuildChaptersFromPageCallback;
};

export async function scrapeChapters(
  scraperContext: ScraperContext,
  scraperCallbacks: ScraperCallbacks,
): Promise<Chapter[]> {
  // start scraping
  const result: ChapterWithoutIndex[] = [];
  let continueScraping = false;
  let pageIndex = 1;
  do {
    const newChapters = await scrapeChapterUrlListPage(
      scraperContext,
      scraperCallbacks,
      pageIndex,
    );
    pageIndex++;

    continueScraping = shouldScrapeNextPage(
      scraperContext.options,
      result,
      newChapters,
    );

    result.push(...newChapters);
  } while (continueScraping);
  // end scraping

  // format index
  let chapterIndex = 1;
  if (scraperContext.options.reverseChapters) {
    result.reverse();
  }
  const chapters = result.map((c) => ({
    ...c,
    index: chapterIndex++,
  }));

  console.log(">> chapters length: ", chapters.length);

  return chapters;
}

async function scrapeChapterUrlListPage(
  context: ScraperContext,
  callbacks: ScraperCallbacks,
  pageIndex: number,
): Promise<ChapterWithoutIndex[]> {
  const { scraper, options } = context;

  // build chapter list page index
  const chapterUrlResult = callbacks.buildChapterPage(context, pageIndex);
  let chapterUrl = "";
  if (typeof chapterUrlResult === "string") {
    chapterUrl = chapterUrlResult;
  } else {
    chapterUrl = await chapterUrlResult;
  }

  // start to fetch chapter url
  let result: ChapterWithoutIndex[] = [];
  try {
    if (options.noWrappedNode) {
      const data = await scraper.fetch(chapterUrl, {
        retryAttempt: 1,
      });

      if (!callbacks.buildChaptersFromPage) {
        throw new Error("Expect callbacks.buildChaptersFromPage");
      }

      const chapters = callbacks.buildChaptersFromPage(context, data);
      result = chapters;
    } else {
      const $ = await scraper.fetchWrappedDOM(chapterUrl, {
        retryAttempt: 1,
      });

      if (callbacks.buildChaptersFromPage) {
        const chapters = callbacks.buildChaptersFromPage(context, $);
        result = chapters;
      } else {
        $(options.selectors.chapterItems).each((i, el) => {
          const chapter = callbacks.nodeToChapter(context, $(el));
          result.push(chapter);
        });
      }
    }
  } finally {
    return result;
  }
}

function shouldScrapeNextPage(
  scraperOptions: ScraperOptions,
  currentChapters: ChapterWithoutIndex[],
  newChapters: ChapterWithoutIndex[],
): boolean {
  const { maxChaptersPerPage } = scraperOptions;
  if (!maxChaptersPerPage || maxChaptersPerPage <= 0) {
    return false;
  }

  let continueScraping = maxChaptersPerPage === newChapters.length;

  if (continueScraping) {
    const oldItems = intersectionBy(
      currentChapters,
      newChapters,
      (chap) => chap.url,
    );

    console.log("oldItems.length", oldItems.length);
    if (oldItems.length > 0) {
      continueScraping = false;
    }
  }

  return continueScraping;
}

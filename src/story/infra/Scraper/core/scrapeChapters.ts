import { intersectionBy } from "../../../../Shared/domain/lodash";
import { Scraper } from "../../../../Shared/domain/Scraper";
import { Chapter } from "../../../domain/Chapter";
import { ScraperOptions, StoryContext } from "../BaseStoryScraper";

export type ChapterWithoutIndex = Omit<Chapter, "index">;

export type ScraperContext = StoryContext & {
  scraper: Scraper;
  options: ScraperOptions;
};

export type ScraperCallbacks = {
  buildChapterPage: (
    context: ScraperContext,
    pageIndex: number,
  ) => string | Promise<string>;
};

export async function scrapeChapters(
  scraperContext: ScraperContext,
  scraperCallbacks: ScraperCallbacks,
): Promise<Chapter[]> {
  // start scraping
  const chaptersWithoutIndexes: ChapterWithoutIndex[] = [];
  let continueScraping = false;
  let pageIndex = 1;
  do {
    const newItems = await scrapeChapterUrlListPage(
      scraperContext,
      scraperCallbacks,
      pageIndex,
    );
    pageIndex++;

    continueScraping = shouldScrapeNextPage(
      scraperContext.options,
      chaptersWithoutIndexes,
      newItems,
    );

    chaptersWithoutIndexes.push(...newItems);
  } while (continueScraping);
  // end scraping

  // format index
  let chapterIndex = 1;
  if (scraperContext.options.reverseChapters) {
    chaptersWithoutIndexes.reverse();
  }
  const chapters = chaptersWithoutIndexes.map((c) => ({
    ...c,
    index: chapterIndex++,
  }));

  // await this.storyRepository.saveChapterList(storyContext.storyName, chapters);
  return chapters;
}

async function scrapeChapterUrlListPage(
  scraperContext: ScraperContext,
  scraperCallbacks: ScraperCallbacks,
  pageIndex: number,
): Promise<ChapterWithoutIndex[]> {
  const { storyName, scraper, options } = scraperContext;

  // build chapter list page index
  const chapterUrlResult = scraperCallbacks.buildChapterPage(
    scraperContext,
    pageIndex,
  );
  let chapterUrl = "";
  if (typeof chapterUrlResult === "string") {
    chapterUrl = chapterUrlResult;
  } else {
    chapterUrl = await chapterUrlResult;
  }

  // start to fetch chapter url
  const chapters: ChapterWithoutIndex[] = [];
  try {
    const $ = await scraper.fetchWrappedDOM(chapterUrl, {
      retryAttempt: 1,
    });
    $(options.selectors.chapterItems).each((i, el) => {
      const chapter = this.nodeToChapter(storyName, $(el));
      chapters.push(chapter);
    });
  } finally {
    return chapters;
  }
}

function shouldScrapeNextPage(
  scraperOptions: ScraperOptions,
  currentChapters: ChapterWithoutIndex[],
  newChapters: ChapterWithoutIndex[],
): boolean {
  const { maxChaptersPerPage } = scraperOptions;
  if (maxChaptersPerPage <= 0) {
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

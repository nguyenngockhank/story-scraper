import { Scraper, WrappedNode } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { ChapterContent } from "../../domain/ChapterContent";
import { StoryRepository } from "../../domain/StoryRepository";
import { StoryMetaData, StoryScraper } from "../../domain/Scraper/StoryScraper";
import { chunk, intersectionBy } from "../../../Shared/domain/lodash";
export type ScraperOptions = {
  baseUrl: string;
  maxChaptersPerPage?: number;
  reverseChapters?: boolean;
  selectors: {
    chapterContent: string;
    chapterItems: string;
  };
};

export type ChapterWithoutIndex = Omit<Chapter, "index">;

export type StoryContext = {
  storyName: string;
  metaData?: StoryMetaData;
};

export abstract class BaseStoryScraper implements StoryScraper {
  protected scraperOptions: ScraperOptions;

  constructor(
    protected scraper: Scraper,
    protected storyRepository: StoryRepository,
  ) {}

  extractStory(url: string): string {
    if (url.endsWith("/")) {
      url = url.slice(0, -1); // remove last char
    }
    const parts = url.split("/");
    return parts[parts.length - 1];
  }

  protected baseUrl(): string {
    return this.scraperOptions.baseUrl;
  }

  extractStoryMetadata(url: string): StoryMetaData {
    return {};
  }
  async fetchChapters(
    story: string,
    metaData?: StoryMetaData,
  ): Promise<Chapter[]> {
    const data: Chapter[] = await this.storyRepository.getChapterList(story);
    if (data && data.length > 0) {
      return data;
    }

    const storyContext: StoryContext = {
      storyName: story,
      metaData: metaData,
    };

    // start scraping
    const chaptersWithoutIndexes: ChapterWithoutIndex[] = [];
    let continueScraping = false;
    let pageIndex = 1;
    do {
      const newItems = await this.scrapeChaptersOnPage(storyContext, pageIndex);
      pageIndex++;

      continueScraping =
        this.scraperOptions.maxChaptersPerPage &&
        this.scraperOptions.maxChaptersPerPage === newItems.length;
      if (continueScraping) {
        const oldItems = intersectionBy(
          chaptersWithoutIndexes,
          newItems,
          (chap) => chap.url,
        );
        console.log("oldItems.length", oldItems.length);
        if (oldItems.length > 0) {
          continueScraping = false;
        }
      }

      chaptersWithoutIndexes.push(...newItems);
    } while (continueScraping);
    // end scraping

    // format index
    let chapterIndex = 1;
    if (this.scraperOptions.reverseChapters) {
      chaptersWithoutIndexes.reverse();
    }
    const chapters = chaptersWithoutIndexes.map((c) => ({
      ...c,
      index: chapterIndex++,
    }));

    await this.storyRepository.saveChapterList(story, chapters);
    return chapters;
  }

  protected async scrapeChaptersOnPage(
    storyContext: StoryContext,
    pageIndex: number,
  ): Promise<ChapterWithoutIndex[]> {
    const { storyName } = storyContext;
    const chapterUrl = this.chapterUrl(storyContext, pageIndex);
    const chapters: ChapterWithoutIndex[] = [];
    try {
      const $ = await this.scraper.fetchWrappedDOM(chapterUrl, {
        retryAttempt: 1,
      });
      $(this.scraperOptions.selectors.chapterItems).each((i, el) => {
        const chapter = this.nodeToChapter(storyName, $(el));
        chapters.push(chapter);
      });
    } finally {
      return chapters;
    }
  }

  abstract chapterUrl(storyContext: StoryContext, pageIndex: number): string;

  abstract nodeToChapter(story: string, $el: WrappedNode): ChapterWithoutIndex;

  async fetchChapterContents(story: string): Promise<ChapterContent[]> {
    const chapters: Chapter[] = await this.storyRepository.getChapterList(
      story,
    );

    const result: ChapterContent[] = [];
    const batches = chunk(chapters, 10);
    for (const batch of batches) {
      const batchResult: ChapterContent[] = await Promise.all(
        batch.map((c) => this.fetchChapterContent(story, c)),
      );
      result.push(...batchResult);
    }
    return result;
  }

  async fetchChapterContent(
    story: string,
    chapter: Chapter,
  ): Promise<ChapterContent> {
    const item: ChapterContent = await this.storyRepository.getChapterContent(
      story,
      chapter.index,
    );
    if (item) {
      return item;
    }

    const content = await this.scrapeChapterContent(chapter);
    const result: ChapterContent = {
      ...chapter,
      content,
    };
    await this.storyRepository.saveChapterContent(story, result);
    return result;
  }

  async scrapeChapterContent(chapter: Chapter): Promise<string> {
    const $ = await this.scraper.fetchWrappedDOM(chapter.url);
    const content = $(this.scraperOptions.selectors.chapterContent)
      .html()
      .trim();
    return content;
  }
}

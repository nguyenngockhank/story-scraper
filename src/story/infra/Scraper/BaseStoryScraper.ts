import { Scraper, WrappedNode } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { ChapterContent } from "../../domain/ChapterContent";
import { StoryRepository } from "../../domain/StoryRepository";
import { StoryScraper } from "../../domain/Scraper/StoryScraper";
import { Node } from "domhandler";
export type ScraperOptions = {
  baseUrl: string;
  maxChaptersPerPage?: number;
  selectors: {
    chapterContent: string;
    chapterContainter: string;
  };
};

export abstract class BaseStoryScraper implements StoryScraper {
  protected scraperOptions: ScraperOptions;

  constructor(
    protected scraper: Scraper,
    protected storyRepository: StoryRepository,
  ) {}

  async fetchChapters(story: string): Promise<Chapter[]> {
    const data: Chapter[] = await this.storyRepository.getChapterList(story);
    if (data && data.length > 0) {
      return data;
    }

    // start scraping
    const chapters: Chapter[] = [];
    let continueScraping = false;
    let pageIndex = 1;
    let itemIndex = 1;
    do {
      const newItems = await this.scrapeChaptersOnPage(
        story,
        pageIndex,
        itemIndex,
      );
      chapters.push(...newItems);
      itemIndex += newItems.length;
      pageIndex++;
      continueScraping =
        newItems.length === this.scraperOptions.maxChaptersPerPage;
    } while (continueScraping);
    // end scraping

    await this.storyRepository.saveChapterList(story, chapters);
    return chapters;
  }

  protected async scrapeChaptersOnPage(
    story: string,
    pageIndex: number,
    startItemIndex: number,
  ): Promise<Chapter[]> {
    const chapterUrl = this.chapterUrl(story, pageIndex);
    const $ = await this.scraper.fetchWrappedDOM(chapterUrl);

    let index = startItemIndex;
    const chapters: Chapter[] = [];
    $(this.scraperOptions.selectors.chapterContainter).each((i, el) => {
      const chapter = this.nodeToChapter($(el));
      chapters.push({
        ...chapter,
        index: index++,
      });
    });
    return chapters;
  }

  abstract chapterUrl(story: string, pageIndex: number): string;

  abstract nodeToChapter($el: WrappedNode): Omit<Chapter, "index">;

  async fetchChapterContents(story: string): Promise<ChapterContent[]> {
    const chapters: Chapter[] = await this.storyRepository.getChapterList(
      story,
    );
    return Promise.all(
      chapters.map((chapter) => this.fetchChapterContent(story, chapter)),
    );
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

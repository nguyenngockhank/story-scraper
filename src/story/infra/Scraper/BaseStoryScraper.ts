import { Scraper, WrappedNode } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { ChapterContent } from "../../domain/ChapterContent";
import { StoryRepository } from "../../domain/StoryRepository";
import { StoryMetaData, StoryScraper } from "../../domain/Scraper/StoryScraper";
import { chunk, replace, trimEnd } from "../../../Shared/domain/lodash";
import { scrapeChapters } from "./core/scrapeChapters";
import { ScraperContext, ScraperOptions } from "./core/CoreTypes";

export type ChapterWithoutIndex = Omit<Chapter, "index">;

export abstract class BaseStoryScraper implements StoryScraper {
  protected scraperOptions: ScraperOptions;

  constructor(
    protected scraper: Scraper,
    protected storyRepository: StoryRepository,
  ) {}

  extractStory(url: string): string {
    url = trimEnd(url, "/");
    url = replace(url, ".html", "");

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

    const context: ScraperContext = {
      storyName: story,
      metaData: metaData,
      options: this.scraperOptions,
      scraper: this.scraper,
    };

    const chapters = await scrapeChapters(context, {
      buildChapterPage: this.buildChapterPageUrl.bind(this),
      nodeToChapter: this.nodeToChapter.bind(this),
    });

    await this.storyRepository.saveChapterList(story, chapters);

    return chapters;
  }

  abstract buildChapterPageUrl(
    scrapeContext: ScraperContext,
    pageIndex: number,
  ): string | Promise<string>;

  abstract nodeToChapter(
    scrapeContext: ScraperContext,
    $el: WrappedNode,
  ): ChapterWithoutIndex;

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

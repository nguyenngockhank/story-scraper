import { Scraper } from "../../../../Shared/domain/Scraper";
import { Chapter } from "../../../domain/Chapter";
import { ChapterContent } from "../../../domain/ChapterContent";
import { StoryRepository } from "../../../domain/StoryRepository";
import {
  StoryMetaData,
  StoryScraper,
} from "../../../domain/Scraper/StoryScraper";
import { chunk, replace, trimEnd } from "../../../../Shared/domain/lodash";
import {
  BuildChaptersFromPageCallback,
  NodeToChapterCallback,
  scrapeChapters,
} from "./scrapeChapters";
import { ScraperContext, ScraperOptions } from "./CoreTypes";
import { ContentFilter, scrapeChapterContent } from "./scrapeChapterContent";

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
      nodeToChapter: this.nodeToChapter?.bind(this),
      buildChaptersFromPage: this.buildChaptersFromPage?.bind(this),
    });

    await this.storyRepository.saveChapterList(story, chapters);

    return chapters;
  }

  abstract buildChapterPageUrl(
    scrapeContext: ScraperContext,
    pageIndex: number,
  ): string | Promise<string>;

  protected buildChaptersFromPage: BuildChaptersFromPageCallback | undefined;

  protected nodeToChapter: NodeToChapterCallback | undefined;

  protected contentFilter: ContentFilter | undefined;

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

  private async fetchChapterContent(
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

    const context: ScraperContext = {
      storyName: story,
      options: this.scraperOptions,
      scraper: this.scraper,
    };

    const chapterContent = await scrapeChapterContent(context, chapter, {
      content: this.contentFilter,
    });

    const result: ChapterContent = {
      ...chapter,
      ...chapterContent,
    };
    await this.storyRepository.saveChapterContent(story, result);
    return result;
  }
}

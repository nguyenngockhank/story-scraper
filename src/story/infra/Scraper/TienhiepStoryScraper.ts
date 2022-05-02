import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper, WrappedNode } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { StoryMetaData } from "../../domain/Scraper/StoryScraper";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import { BaseStoryScraper, ScraperOptions } from "./BaseStoryScraper";
import { ScraperContext } from "./core/scrapeChapters";

@Injectable()
export class TienhiepStoryScraper extends BaseStoryScraper {
  protected scraperOptions: ScraperOptions = {
    baseUrl: "https://tienhiep.net",
    maxChaptersPerPage: 50,
    selectors: {
      chapterContent: ".chapter-content",
      chapterItems: ".table-striped td",
    },
  };

  constructor(
    @Inject(appItems.Scraper)
    protected scraper: Scraper,

    @Inject(storyItems.StoryRepository)
    protected storyRepository: StoryRepository,
  ) {
    super(scraper, storyRepository);
  }

  extractStoryMetadata(url: string): StoryMetaData {
    // e.g: https://tienhiep.net/truyen/11539/khien-em-ga-cho-anh
    const parts = url.split("/");
    const storyId = parts[parts.length - 2];
    return {
      storyId,
    };
  }

  buildChapterPageUrl(
    { storyName, metaData }: ScraperContext,
    pageIndex: number,
  ): string {
    if (!metaData.storyId) {
      throw new Error("Expect storyId in metaData");
    }
    return `${this.scraperOptions.baseUrl}/danh-sach-chuong/${metaData.storyId}/${storyName}?page=${pageIndex}`;
  }

  nodeToChapter(story: string, $el: WrappedNode): Omit<Chapter, "index"> {
    const chapterUrl = $el.find("a").attr("href").trim();
    return {
      url: this.scraperOptions.baseUrl + chapterUrl,
      title: $el.text().trim(),
    };
  }
}

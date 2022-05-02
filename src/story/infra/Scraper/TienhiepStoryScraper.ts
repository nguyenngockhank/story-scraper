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
import { BaseStoryScraper } from "./core/BaseStoryScraper";
import { ScraperContext } from "./core/CoreTypes";

@Injectable()
export class TienhiepStoryScraper extends BaseStoryScraper {
  protected scraperOptions = {
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
    { storyName, metaData, options }: ScraperContext,
    pageIndex: number,
  ): string {
    if (!metaData.storyId) {
      throw new Error("Expect storyId in metaData");
    }
    return `${options.baseUrl}/danh-sach-chuong/${metaData.storyId}/${storyName}?page=${pageIndex}`;
  }

  nodeToChapter = (context, $el: WrappedNode): Omit<Chapter, "index"> => {
    const chapterUrl = $el.find("a").attr("href").trim();
    return {
      url: this.scraperOptions.baseUrl + chapterUrl,
      title: $el.text().trim(),
    };
  };
}

import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper, WrappedNode } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import {
  BaseStoryScraper,
  ScraperOptions,
  StoryContext,
} from "./BaseStoryScraper";

@Injectable()
export class DtruyenStoryScraper extends BaseStoryScraper {
  protected scraperOptions: ScraperOptions = {
    baseUrl: "https://dtruyen.com",
    maxChaptersPerPage: 30,
    selectors: {
      chapterContent: "#chapter-content",
      chapterItems: "#chapters .chapters li",
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

  chapterUrl(storyContext: StoryContext, pageIndex: number): string {
    const { storyName } = storyContext;
    if (pageIndex === 1) {
      return `${this.scraperOptions.baseUrl}/${storyName}/`;
    }
    return `${this.scraperOptions.baseUrl}/${storyName}/${pageIndex}/`;
  }

  nodeToChapter(story: string, $el: WrappedNode): Omit<Chapter, "index"> {
    return {
      url: $el.find("a").attr("href").trim(),
      title: $el.find("a").text().trim(),
    };
  }
}

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
export class BoygiasStoryScraper extends BaseStoryScraper {
  protected scraperOptions: ScraperOptions = {
    baseUrl: "https://boygias.com",
    maxChaptersPerPage: 10,
    reverseChapters: true,
    selectors: {
      chapterContent: ".post-content",
      chapterItems: ".content-wrapper .articles article",
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
    if (pageIndex > 1) {
      return `${this.scraperOptions.baseUrl}/series/${storyName}/page/${pageIndex}/`;
    }
    return `${this.scraperOptions.baseUrl}/series/${storyName}/`;
  }

  nodeToChapter(story: string, $el: WrappedNode): Omit<Chapter, "index"> {
    return {
      url: $el.find("h1 a").attr("href").trim(),
      title: $el.find("h1 a").text().trim(),
    };
  }
}

import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper, WrappedNode } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import { BaseStoryScraper, ScraperOptions } from "./BaseStoryScraper";

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

  chapterUrl(story: string, pageIndex: number): string {
    if (pageIndex > 1) {
      return `${this.scraperOptions.baseUrl}/series/${story}/page/${pageIndex}/`;
    }
    return `${this.scraperOptions.baseUrl}/series/${story}/`;
  }

  nodeToChapter($el: WrappedNode): Omit<Chapter, "index"> {
    return {
      url: $el.find("h1 a").attr("href").trim(),
      title: $el.find("h1 a").text().trim(),
    };
  }
}

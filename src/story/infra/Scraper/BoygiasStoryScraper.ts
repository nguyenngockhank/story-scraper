import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper, WrappedNode } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import { BaseStoryScraper } from "./core/BaseStoryScraper";
import { ScraperContext, ScraperOptions } from "./core/CoreTypes";

@Injectable()
export class BoygiasStoryScraper extends BaseStoryScraper {
  public options: ScraperOptions = {
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

  buildChapterPageUrl(
    { storyName, options: { baseUrl } }: ScraperContext,
    pageIndex: number,
  ): string | Promise<string> {
    if (pageIndex > 1) {
      return `${baseUrl}/series/${storyName}/page/${pageIndex}/`;
    }
    return `${baseUrl}/series/${storyName}/`;
  }

  nodeToChapter = (context, $el: WrappedNode): Omit<Chapter, "index"> => {
    return {
      url: $el.find("h1 a").attr("href").trim(),
      title: $el.find("h1 a").text().trim(),
    };
  };
}

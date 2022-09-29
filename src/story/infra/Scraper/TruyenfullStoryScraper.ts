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
import { ScraperContext } from "./core/CoreTypes";

@Injectable()
export class TruyenfullStoryScraper extends BaseStoryScraper {
  protected options = {
    baseUrl: "https://truyenfull.vn/",
    maxChaptersPerPage: 50,
    selectors: {
      chapterContent: ".chapter-c",
      chapterItems: ".list-chapter li",
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
    { storyName, options }: ScraperContext,
    pageIndex: number,
  ): string {
    return `${options.baseUrl}${storyName}/trang-${pageIndex}`;
  }

  nodeToChapter = (context, $el: WrappedNode): Omit<Chapter, "index"> => {
    return {
      url: $el.find("a").attr("href").trim(),
      title: $el.text().trim(),
    };
  };
}

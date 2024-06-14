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
export class DoctruyenchufulXyzScraper extends BaseStoryScraper {
  public options = {
    baseUrl: "https://doctruyenchufull.xyz/",
    maxChaptersPerPage: 20,
    batch: {
      numberItems: 5,
      sleepMs: 3000,
    },
    selectors: {
      chapterContent: ".blog-post-body",
      chapterItems: "#danh_sach_chuong li",
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
    if (pageIndex === 1) return `${options.baseUrl}${storyName}`;

    return `${options.baseUrl}${storyName}/${pageIndex}`;
  }

  nodeToChapter = (context, $el: WrappedNode): Omit<Chapter, "index"> => {
    return {
      url: $el.find("a").attr("href").trim(),
      title: $el.text().trim(),
    };
  };
}

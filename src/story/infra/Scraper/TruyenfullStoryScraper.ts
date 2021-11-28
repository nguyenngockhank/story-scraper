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
export class TruyenfullStoryScraper extends BaseStoryScraper {
  protected scraperOptions: ScraperOptions = {
    baseUrl: "https://truyenfull.vn/",
    maxChaptersPerPage: 50,
    selectors: {
      chapterContent: ".chapter-c",
      chapterContainter: ".list-chapter li",
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
    return `${this.scraperOptions.baseUrl}/${story}/trang-${pageIndex}`;
  }

  nodeToChapter($el: WrappedNode): Omit<Chapter, "index"> {
    return {
      url: $el.find("a").attr("href").trim(),
      title: $el.text().trim(),
    };
  }
}

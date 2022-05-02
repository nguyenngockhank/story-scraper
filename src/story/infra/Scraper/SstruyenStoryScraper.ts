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
import { ScraperContext } from "./core/scrapeChapters";

@Injectable()
export class SstruyenStoryScraper extends BaseStoryScraper {
  protected scraperOptions: ScraperOptions = {
    baseUrl: "https://sstruyen.com",
    maxChaptersPerPage: 32,
    selectors: {
      chapterContent: ".content.container1",
      chapterItems: ".list-chap li",
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
    { storyName }: ScraperContext,
    pageIndex: number,
  ): string {
    if (pageIndex === 1) {
      return `${this.scraperOptions.baseUrl}/${storyName}/`;
    }
    return `${this.scraperOptions.baseUrl}/${storyName}/trang-${pageIndex}/`;
  }

  nodeToChapter(story: string, $el: WrappedNode): Omit<Chapter, "index"> {
    let chapterUrl = $el.find("a").attr("href").trim();
    // fill prefix
    if (!chapterUrl.startsWith(`/${story}/`)) {
      chapterUrl = `/${story}/${chapterUrl}`;
    }

    return {
      url: `${this.scraperOptions.baseUrl}${chapterUrl}`,
      title: $el.find("a").text().trim(),
    };
  }
}

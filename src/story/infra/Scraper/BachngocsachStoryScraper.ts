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
import { ScraperContext } from "./core/scrapeChapters";

@Injectable()
export class BachngocsachStoryScraper extends BaseStoryScraper {
  protected scraperOptions: ScraperOptions = {
    baseUrl: "https://bachngocsach.com/",
    selectors: {
      chapterContent: "#noi-dung",
      chapterItems: "#mucluc-list li",
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

  buildChapterPageUrl({ storyName }: ScraperContext): string | Promise<string> {
    return `${this.baseUrl()}/reader/${storyName}/muc-luc?page=all`;
  }

  nodeToChapter(story: string, $el: WrappedNode): Omit<Chapter, "index"> {
    return {
      url: this.baseUrl() + $el.find("a").attr("href").trim(),
      title: $el.find("a").text().trim(),
    };
  }
}

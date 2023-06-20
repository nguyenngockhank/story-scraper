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
export class BachngocsachStoryScraper extends BaseStoryScraper {
  protected options = {
    baseUrl: "https://bachngocsach.com.vn/",
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

  buildChapterPageUrl({
    storyName,
    options: { baseUrl },
  }: ScraperContext): string | Promise<string> {
    return `${baseUrl}/reader/${storyName}/muc-luc?page=all`;
  }

  nodeToChapter = (context, $el: WrappedNode): Omit<Chapter, "index"> => {
    return {
      url: this.baseUrl() + $el.find("a").attr("href").trim(),
      title: $el.find("a").text().trim(),
    };
  };
}

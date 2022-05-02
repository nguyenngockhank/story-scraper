import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper, WrappedNode } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import { BaseStoryScraper } from "./BaseStoryScraper";
import { ScraperContext } from "./core/CoreTypes";

@Injectable()
export class DtruyenStoryScraper extends BaseStoryScraper {
  protected scraperOptions = {
    baseUrl: "https://thichtienhiep.com",
    maxChaptersPerPage: 0,
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

  buildChapterPageUrl({
    storyName,
    options: { baseUrl },
  }: ScraperContext): string {
    const url = `${baseUrl}/doc-truyen/${storyName}.html`;
    return url;
    // const $ = await this.scraper.fetchWrappedDOM(url);
    // const imgSrc = $(".preview-thumbnail img").attr("src");
    // const storyIndex = 5;
    // const storyId = imgSrc.split("/")[storyIndex];
    // return `${baseUrl}/api/v1/stories/${storyId}/chapters`;
  }

  nodeToChapter(context, $el: WrappedNode): Omit<Chapter, "index"> {
    return {
      url: $el.find("a").attr("href").trim(),
      title: $el.find("a").text().trim(),
    };
  }
}

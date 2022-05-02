import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper, WrappedDOM } from "../../../Shared/domain/Scraper";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import { BaseStoryScraper } from "./core/BaseStoryScraper";
import { ChapterWithoutIndex, ScraperContext } from "./core/CoreTypes";
import { ContentFilter } from "./core/scrapeChapterContent";

@Injectable()
export class ThichTienHiepStoryScraper extends BaseStoryScraper {
  protected scraperOptions = {
    baseUrl: "https://thichtienhiep.com",
    maxChaptersPerPage: 0,
    selectors: {
      chapterContent: "#text-content",
      chapterItems: "N/A",
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
    return `${baseUrl}/doc-truyen/${storyName}.html`;
  }

  buildChaptersFromPage = (
    { storyName, options: { baseUrl } }: ScraperContext,
    $: WrappedDOM,
  ) => {
    // <title>Truyện Tu Chân Liêu Thiên Quần 3178 chương - Đọc truyện FULL</title>
    const titleStr = $("title").text();
    const titleWords = titleStr.split(" ");
    const chapterCount = Number(titleWords[titleWords.length - 6]);

    const result: ChapterWithoutIndex[] = [];
    for (let i = 1; i <= chapterCount; ++i) {
      result.push({
        url: `${baseUrl}/doc-truyen/${storyName}/chuong-${i}.html`,
        title: `Chapter ${i}`,
      });
    }
    return result;
  };

  protected contentFilter: ContentFilter = (rawContent, $content): string => {
    $content.find("p").first().remove();
    return $content.html();
  };
}

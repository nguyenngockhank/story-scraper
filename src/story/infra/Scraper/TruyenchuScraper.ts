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
import cheerio, { CheerioAPI } from "cheerio";
import {
  ChapterWithoutIndex,
  ScraperContext,
  ScraperOptions,
} from "./core/CoreTypes";

@Injectable()
export class TruyenchuScraper extends BaseStoryScraper {
  public options: ScraperOptions = {
    baseUrl: "https://truyenchu.vn/",
    scrapeChaptersType: "onApi",
    maxChaptersPerPage: 50,
    selectors: {
      chapterContent: "#chapter-c",
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
    return `${options.baseUrl}api/services/list-chapter?type=list_chapter&tascii=${storyName}&page=${pageIndex}`;
  }

  protected toChapters(
    context: ScraperContext,
    jsonData: any,
  ): ChapterWithoutIndex[] {
    const { options } = context;
    const $ = cheerio.load(jsonData.chap_list);

    const result: ChapterWithoutIndex[] = [];
    $(options.selectors.chapterItems).each((i, el) => {
      const chapter = this.nodeToChapter(context, $(el));
      result.push(chapter);
    });

    return result;
  }

  nodeToChapter = (context, $el: WrappedNode): Omit<Chapter, "index"> => {
    return {
      url: this.options.baseUrl + $el.find("a").attr("href").trim(),
      title: $el.text().trim(),
    };
  };
}

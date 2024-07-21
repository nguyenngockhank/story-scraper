import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper } from "../../../Shared/domain/Scraper";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import { BaseStoryScraper } from "./core/BaseStoryScraper";
import {
  ChapterWithoutIndex,
  ScraperContext,
  ScraperOptions,
} from "./core/CoreTypes";

@Injectable()
export class TruyenfullComStoryScraper extends BaseStoryScraper {
  public options: ScraperOptions = {
    baseUrl: "https://truyenfull.com/",
    scrapeChaptersType: "onApi",
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
    const [, storyId] = storyName.split(".");
    // https://truyenfull.com/api/chapters/32797/2/50
    return `${options.baseUrl}api/chapters/${storyId}/${pageIndex}/50`;
  }

  protected toChapters(
    { options, metaData }: ScraperContext,
    jsonData: any,
  ): ChapterWithoutIndex[] {
    if (!metaData.storySlug) {
      throw new Error(
        "Require metadata storySlug... Lookup in storyAlias in html",
      );
    }

    const items: Array<{ chapter_name: string }> = jsonData.items;

    const result: ChapterWithoutIndex[] = items.map((item) => {
      const [preStr] = item.chapter_name.split(":");
      const [, indexsStr] = preStr.split(" ");
      return {
        title: item.chapter_name,
        url: `${options.baseUrl}${metaData.storySlug}/chuong-${indexsStr}.html`,
      };
    });
    return result;
  }
}

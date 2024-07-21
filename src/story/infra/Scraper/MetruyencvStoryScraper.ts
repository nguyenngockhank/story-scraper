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
export class MetruyencvStoryScraper extends BaseStoryScraper {
  public options: ScraperOptions = {
    baseUrl: "https://metruyencv.com",
    scrapeChaptersType: "onApi",
    selectors: {
      chapterContent: '[data-x-bind="ChapterContent"]',
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

  buildChapterPageUrl({ metaData }: ScraperContext): string {
    const { storyId } = metaData;
    if (!storyId) {
      throw new Error(
        "Require metadata storyId... Lookup in <div data-x-data='reading(storyId)' ... /> in html",
      );
    }

    return `https://backend.metruyencv.com/api/chapters?filter%5Bbook_id%5D=${storyId}&filter%5Btype%5D=published`;
  }

  protected toChapters(
    context: ScraperContext,
    jsonData: any,
  ): ChapterWithoutIndex[] {
    const { storyName, options } = context;

    const chapters: Array<{ index: number; name: string }> = jsonData.data;

    return chapters.map((item): ChapterWithoutIndex => {
      return {
        url: `${options.baseUrl}/truyen/${storyName}/chuong-${item.index}`,
        title: item.name,
      };
    });
  }
}

import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper, WrappedNode } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { StoryMetaData } from "../../domain/Scraper/StoryScraper";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import { BaseStoryScraper } from "./core/BaseStoryScraper";
import {
  ChapterWithoutIndex,
  ScraperContext,
  ScraperOptions,
} from "./core/CoreTypes";

@Injectable()
export class MetruyenchuStoryScraper extends BaseStoryScraper {
  protected options: ScraperOptions = {
    baseUrl: "https://metruyenchu.com",
    scrapeChaptersType: "onApi",
    selectors: {
      chapterContent: "#js-read__content",
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

  buildChapterPageUrl(
    { metaData, storyName, options: { baseUrl } }: ScraperContext,
    pageIndex: number,
  ): string {
    const { storyId, token } = metaData;
    if (!storyId) {
      throw new Error("Should fulfill `storyId` param");
    }

    if (!token) {
      throw new Error("Should fulfill `token` param");
    }

    return `https://api.truyen.onl/v2/chapters?book_id=${storyId}&sign=${token}`;
  }

  async fetchStoryMetadata(url: string): Promise<StoryMetaData> {
    return {
      storyId: "109334",
      token:
        "eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJqdGkiOiJsNnFzeWZraCIsImlzcyI6InYyL2NoYXB0ZXJzIiwic3ViIjoiRkUtTWVUcnV5ZW5DaHUiLCJleHAiOjE2NjAzMzI0OTZ9.zQD4Wgduys64kG7dKcTnu_s1p0LGq-BlrcA2HJ7Fy7Y",
    };
  }

  nodeToChapter = (context, $el: WrappedNode): Omit<Chapter, "index"> => {
    return {
      url: $el.find("a").attr("href").trim(),
      title: $el.find("a").text().trim(),
    };
  };

  protected toChapters(
    context: ScraperContext,
    jsonData: any,
  ): ChapterWithoutIndex[] {
    const { storyName } = context;
    return jsonData._data.chapters.map((item): ChapterWithoutIndex => {
      return {
        url: `https://metruyenchu.com/truyen/${storyName}/chuong-${item.index}`,
        title: item.name,
      };
    });
  }
}

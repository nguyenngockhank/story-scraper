import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper, WrappedDOM } from "../../../Shared/domain/Scraper";
import { StoryMetaData } from "../../domain/Scraper/StoryScraper";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import { BaseStoryScraper } from "./core/BaseStoryScraper";
import { ScraperContext } from "./core/CoreTypes";

@Injectable()
export class TangThuVienStoryScraper extends BaseStoryScraper {
  public options = {
    baseUrl: "https://truyen.tangthuvien.vn",
    noWrappedNode: true,
    maxChaptersPerPage: 100,
    selectors: {
      chapterContent: ".box-chap",
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

  async fetchStoryMetadata(url: string): Promise<StoryMetaData> {
    const $ = await this.scraper.fetchWrappedDOM(url);
    const metaTags = $(`meta`).find(`[name="book_detail"]`);
    const storyId = metaTags.attr("content");
    const lastHref = $(".volume:nth-child(1) a").first().attr("href");

    // e.g: https://truyen.tangthuvien.vn/doc-truyen/van-gioi-diem-danh-sach
    const maxChapter = parseInt(lastHref.split("/chuong-")[1]);
    return {
      storyId,
      maxChapter,
    };
  }

  buildChapterPageUrl({ metaData, storyName }: ScraperContext): string {
    return `https://truyen.tangthuvien.vn/doc-truyen/${storyName}`;
    /**
     * 
    
    if (!metaData.storyId) {
      throw new Error("Expect storyId in metaData");
    }

    return `https://truyen.tangthuvien.vn/doc-truyen/page/${
      metaData.storyId
    }?page=${pageIndex - 1}&limit=100&web=1`;
     */
  }

  buildChaptersFromPage = ({ storyName, metaData }: ScraperContext) => {
    if (!metaData.maxChapter) {
      throw new Error("Expect maxChapter in metaData");
    }

    const result = [];
    for (let i = 1; i < metaData.maxChapter; ++i) {
      result.push({
        url: `https://truyen.tangthuvien.vn/doc-truyen/${storyName}/chuong-${i}`,
        title: `Chapter ${i}`,
      });
    }

    return result;
  };
}

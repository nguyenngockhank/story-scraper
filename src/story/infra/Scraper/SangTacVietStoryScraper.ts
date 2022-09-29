import {
  appItems,
  Injectable,
  Inject,
} from "../../../Shared/domain/AppContainer";
import { Scraper } from "../../../Shared/domain/Scraper";
import { StoryMetaData } from "../../domain/Scraper/StoryScraper";
import { storyItems } from "../../domain/StoryContainer";
import { StoryRepository } from "../../domain/StoryRepository";
import { BaseStoryScraper } from "./core/BaseStoryScraper";
import { ChapterWithoutIndex, ScraperContext } from "./core/CoreTypes";

@Injectable()
export class SangTacVietStoryScraper extends BaseStoryScraper {
  protected options = {
    baseUrl: "https://sangtacviet.info",
    noWrappedNode: true,
    selectors: {
      chapterContent: "N/A",
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
    // e.g:
    const parts = url.split("/");
    const storyId = parts[parts.length - 2];
    const storySlug = parts[parts.length - 4];
    return {
      storyId,
      storySlug,
    };
  }

  buildChapterPageUrl({ metaData, options }: ScraperContext): string {
    if (!metaData.storyId || !metaData.storySlug) {
      throw new Error("Expect storyId in metaData");
    }
    return `${options.baseUrl}/index.php?ngmar=chapterlist&h=${metaData.storySlug}&bookid=${metaData.storyId}&sajax=getchapterlist`;
  }

  buildChaptersFromPage = (
    { storyName, options: { baseUrl }, metaData }: ScraperContext,
    pageContent: string,
  ) => {
    const data: { data: string } = JSON.parse(pageContent);
    const rawChapters = data.data.split("-//-").map((item) => {
      const pieces = item.split("-/-");
      return { chapterId: pieces[1], title: pieces[2] };
    });

    return rawChapters.map((rChap): ChapterWithoutIndex => {
      throw new Error("implement this");
      // return {
      // url: `${baseUrl}/doc-truyen/${storyName}/chuong-${i}.html`,
      // title: `Chapter ${i}`,
      // };
    });
  };
}

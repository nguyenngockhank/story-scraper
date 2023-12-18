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

/** 
const result = [];
$(listChapter.list_chapter).find("li a").each((i,el) => { 
  $el = $(el); 
  result.push({ 
    title: $el.text().trim(), 
    url: `https://truyenchu.vn` + $el.attr('href'),
    index: i,
    id: `${i}`
  })
});



result.map(item => JSON.stringify(item)).join("\n")

console.log(result)
*/

@Injectable()
export class TruyenchuScraper extends BaseStoryScraper {
  protected options = {
    baseUrl: "https://truyenchu.vn/",
    maxChaptersPerPage: 50,
    selectors: {
      chapterContent: ".chapter-content",
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

  nodeToChapter = (context, $el: WrappedNode): Omit<Chapter, "index"> => {
    return {
      url: $el.find("a").attr("href").trim(),
      title: $el.text().trim(),
    };
  };
}

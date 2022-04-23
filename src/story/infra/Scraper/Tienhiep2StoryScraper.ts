import { Injectable } from "../../../Shared/domain/AppContainer";
import { ScraperOptions } from "./BaseStoryScraper";
import { TienhiepStoryScraper } from "./TienhiepStoryScraper";

@Injectable()
export class Tienhiep2StoryScraper extends TienhiepStoryScraper {
  protected scraperOptions: ScraperOptions = {
    baseUrl: "https://tienhiep2.net",
    maxChaptersPerPage: 50,
    selectors: {
      chapterContent: ".chapter-content",
      chapterItems: ".table-striped td",
    },
  };
}

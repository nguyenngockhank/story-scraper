import { Injectable } from "../../../Shared/domain/AppContainer";
import { TienhiepStoryScraper } from "./TienhiepStoryScraper";

@Injectable()
export class Tienhiep2StoryScraper extends TienhiepStoryScraper {
  protected options = {
    baseUrl: "https://tienhiep2.net",
    maxChaptersPerPage: 50,
    selectors: {
      chapterContent: ".chapter-content",
      chapterItems: ".table-striped td",
    },
  };
}

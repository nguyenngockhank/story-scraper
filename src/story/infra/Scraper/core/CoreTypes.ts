import { Scraper } from "../../../../Shared/domain/Scraper";
import { Chapter } from "../../../domain/Chapter";
import { StoryMetaData } from "../../../domain/Scraper/StoryScraper";

export type ChapterWithoutIndex = Omit<Chapter, "index">;

export type ScraperOptions = {
  baseUrl: string;
  maxChaptersPerPage?: number;
  reverseChapters?: boolean;
  noWrappedNode?: boolean;
  selectors: {
    chapterContent: string;
    chapterItems: string;
  };
};

export type ScraperContext = {
  storyName: string;
  metaData?: StoryMetaData;
  scraper: Scraper;
  options: ScraperOptions;
};

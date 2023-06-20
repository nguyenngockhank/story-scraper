import { StorySlugFulfillHandler } from "../ScraperHandler/StorySlugFulfillHandler";

export enum ScraperType {
  metruyenchu = "metruyenchu",
}
export class ScraperFactory {
  create(type: ScraperType) {
    const fulfillStorySlug = new StorySlugFulfillHandler();
  }
}

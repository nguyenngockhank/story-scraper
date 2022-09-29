import { Scraper } from "../../../Shared/domain/Scraper";
import { Chapter } from "../../domain/Chapter";
import { StoryRepository } from "../../domain/StoryRepository";
import { ScraperContext as RawScraperContext } from "../Scraper/core/CoreTypes";

export type ScraperPayload = {
  url: string;
  // to fulfill
  metaData: Record<string, any>;
  storySlug?: string;
  chapters?: Chapter[];
};

export type ScraperContext = RawScraperContext & {
  payload?: ScraperPayload;
  storyRepository: StoryRepository;
  scraper: Scraper;
};

interface Handler {
  setNext(handler: Handler): Handler;

  handle(context: ScraperContext, payload: ScraperPayload): Promise<void>;
}

export abstract class AbstractHandler implements Handler {
  private nextHandler: Handler;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  async handle(
    context: ScraperContext,
    payload: ScraperPayload,
  ): Promise<void> {
    await this.execute(context, payload);

    if (this.nextHandler) {
      return this.nextHandler.handle(context, payload);
    }
  }

  protected abstract execute(
    context: ScraperContext,
    payload: ScraperPayload,
  ): Promise<void>;
}

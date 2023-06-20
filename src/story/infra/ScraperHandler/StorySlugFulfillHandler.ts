import { last, replace, trimEnd } from "../../../Shared/domain/lodash";
import {
  AbstractHandler,
  ScraperContext,
  ScraperPayload,
} from "./AbstractHandler";

export class StorySlugFulfillHandler extends AbstractHandler {
  async execute(
    context: ScraperContext,
    payload: ScraperPayload,
  ): Promise<void> {
    let slug = trimEnd(payload.url, "/");
    slug = replace(slug, ".html", "");
    const parts = slug.split("/");
    payload.storySlug = last(parts);
  }
}

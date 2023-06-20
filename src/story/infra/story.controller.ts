import { Controller, Post, Body } from "@nestjs/common";
import { ScrapeStoryByUrlUseCase } from "../use-cases/ScrapeStoryByUrlUseCase";
import { ScrapeStoryByProviderUseCase } from "../use-cases/ScrapeStoryByProviderUseCase";
import {
  StoryScrapeByProviderStoryPayload,
  StoryScrapeByUrlPayload,
  isStoryScrapeByUrlPayload,
} from "./Payload/StoryScrapePayload";
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";

@Controller()
@ApiTags("Story")
@ApiExtraModels(StoryScrapeByUrlPayload, StoryScrapeByProviderStoryPayload)
export class StoryController {
  constructor(
    private scrapeStoryByProviderUC: ScrapeStoryByProviderUseCase,
    private scrapeStoryByUrlUC: ScrapeStoryByUrlUseCase,
  ) {}

  @Post("api/story/scrape")
  @ApiOperation({
    summary: "Scrape story to local",
  })
  @ApiBody({
    schema: {
      oneOf: [
        {
          $ref: getSchemaPath(StoryScrapeByUrlPayload),
        },
        {
          $ref: getSchemaPath(StoryScrapeByProviderStoryPayload),
        },
      ],
    },
  })
  scrapeStory(
    @Body()
    payload: StoryScrapeByUrlPayload | StoryScrapeByProviderStoryPayload,
  ) {
    if (isStoryScrapeByUrlPayload(payload)) {
      return this.scrapeStoryByUrlUC.execute(payload.url);
    }

    return this.scrapeStoryByProviderUC.execute(
      payload.provider,
      payload.story,
      payload.metadata,
    );
  }
}

import { ApiProperty } from "@nestjs/swagger";
import { SourceProvider } from "../MemoryStoryScraperRepository";

export class StoryScrapeByUrlPayload {
  @ApiProperty({
    type: String,
    description: "Link of the story",
    required: true,
    example:
      "https://bachngocsach.com.vn/reader/thua-lo-thanh-thu-phu-tu-tro-choi-convert",
  })
  url: string;

  @ApiProperty({
    required: false,
  })
  metadata: Record<string, string>;
}

export class StoryScrapeByProviderStoryPayload {
  @ApiProperty({
    type: String,
    description: "Slug of story",
    required: true,
  })
  story: string;

  @ApiProperty({
    type: String,
    enum: Object.keys(SourceProvider),
    required: true,
  })
  provider: string;

  @ApiProperty({
    required: false,
  })
  metadata: Record<string, string>;
}

export type ScrapeStoryPayload =
  | StoryScrapeByUrlPayload
  | StoryScrapeByProviderStoryPayload;

export function isStoryScrapeByUrlPayload(
  payload: ScrapeStoryPayload,
): payload is StoryScrapeByUrlPayload {
  return !!(payload as any).url;
}

import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";

export const storyParam: ApiPropertyOptions = {
  type: String,
  description: "Story - the created folder on your disk after scraping",
  example: "tri-lieu-su-cap-sss",
  required: true,
};

export class StoryToEpubPayload {
  @ApiProperty(storyParam)
  story: string;

  @ApiProperty({
    type: Number,
    description: "Chapter per file",
    required: false,
    default: 100,
  })
  chapPerFile?: number;
}

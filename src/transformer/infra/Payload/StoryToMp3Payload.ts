import { ApiProperty } from "@nestjs/swagger";
import { storyParam } from "./StoryToEpubPayload";

export class StoryToMp3Payload {
  @ApiProperty(storyParam)
  story: string;

  @ApiProperty({
    type: Number,
    description:
      "Adjust the speed - lower than 1 for slower, higher than 1 for faster",
    required: false,
  })
  tempo?: number;

  @ApiProperty({
    type: Number,
    description: "The chapter where to start",
    default: 1,
    required: false,
  })
  fromChapter?: number;

  @ApiProperty({
    type: Number,
    description: "Output will be splitted multiple folders if given this param",
    default: 1,
    required: false,
  })
  splitPerFolder?: number;
}

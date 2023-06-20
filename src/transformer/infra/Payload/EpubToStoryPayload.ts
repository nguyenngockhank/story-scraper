import { ApiProperty } from "@nestjs/swagger";

export class EpubToStoryPayload {
  @ApiProperty({
    type: String,
    description: "Path to epub",
    required: true,
    example: "/apple/Downloads/abc.epub",
  })
  inputFile: string;
}

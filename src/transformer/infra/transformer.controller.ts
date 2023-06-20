import { Controller, Post, Body, Get, Param, Query } from "@nestjs/common";
import { EpubsToMp3UseCase } from "../use-cases/EpubsToMp3UseCase";
import { EpubToMp3UseCase } from "../use-cases/EpubToMp3UseCase";
import { EpubToStoryUseCase } from "../use-cases/EpubToStoryUseCase";
import { GetFilesUseCase } from "../use-cases/GetFilesUseCase";
import { StoryToEpubUseCase } from "../use-cases/StoryToEpubUseCase";
import { StoryToMp3UseCase } from "../use-cases/StoryToMp3UseCase";

@Controller()
export class TransformerController {
  constructor(
    private epubToStoryUC: EpubToStoryUseCase,
    private storyToMp3UC: StoryToMp3UseCase,
    private storyToEpubUC: StoryToEpubUseCase,
    private epubToMp3UC: EpubToMp3UseCase,
    private epubsToMp3UC: EpubsToMp3UseCase,
    private getEpubFilesUC: GetFilesUseCase,
  ) {}

  @Post("api/transformer/epub-to-story")
  epubToStory(@Body() payload: { inputFile: string }) {
    return this.epubToStoryUC.execute(payload.inputFile);
  }

  @Post("api/transformer/story-to-mp3")
  storyToMp3(
    @Body()
    payload: {
      story: string;
      fromChapter: number;
      tempo?: number;
      splitPerFolder?: number;
    },
  ) {
    const fromChapter =
      Number(payload.fromChapter) > 0 ? Number(payload.fromChapter) : 1;
    const tempo = Number(payload.tempo) > 0 ? Number(payload.tempo) : undefined;
    const splitPerFolder =
      Number(payload.splitPerFolder) > 0
        ? Number(payload.splitPerFolder)
        : undefined;
    return this.storyToMp3UC.execute(
      payload.story,
      fromChapter,
      tempo,
      splitPerFolder,
    );
  }

  @Post("api/transformer/story-to-epub")
  storyToEpub(@Body() payload: { story: string; chapPerFile?: number }) {
    const chapPerFile =
      Number(payload.chapPerFile) > 0 ? Number(payload.chapPerFile) : 100;
    return this.storyToEpubUC.execute(payload.story, chapPerFile);
  }

  @Post("api/transformer/epub-to-mp3")
  epubToMp3(@Body() payload: { inputFile: string }) {
    return this.epubToMp3UC.execute(payload.inputFile);
  }

  @Post("api/transformer/epubs-to-mp3")
  epubsToMp3(@Body() payload: { inputFiles: string[] }) {
    return this.epubsToMp3UC.execute(payload.inputFiles);
  }

  @Get("api/traverse/:ext")
  traverseEpub(
    @Param("ext") ext = "epub",
    @Query("recursive") recursive = true,
    @Query("dir") dir: string,
    @Query("keyword") keyword?: string,
  ) {
    return this.getEpubFilesUC.execute(dir, keyword, ext, recursive);
  }
}

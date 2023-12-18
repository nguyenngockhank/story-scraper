import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";
import { EpubsToMp3UseCase } from "../use-cases/EpubsToMp3UseCase";
import { EpubToMp3UseCase } from "../use-cases/EpubToMp3UseCase";
import { EpubToStoryUseCase } from "../use-cases/EpubToStoryUseCase";
import { GetFilesUseCase } from "../use-cases/GetFilesUseCase";
import { StoryToEpubUseCase } from "../use-cases/StoryToEpubUseCase";
import { StoryToMp3UseCase } from "../use-cases/StoryToMp3UseCase";
import { EpubToMp3Payload } from "./Payload/EpubToMp3Payload";
import { StoryToEpubPayload } from "./Payload/StoryToEpubPayload";
import { EpubToStoryPayload } from "./Payload/EpubToStoryPayload";
import { StoryToMp3Payload } from "./Payload/StoryToMp3Payload";
import { ApiTags } from "@nestjs/swagger";
import { TextToMp3UserCase } from "../use-cases/TextToMp3UserCase";
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
} from "@nestjs/platform-express/multer";
import { FileToMp3UserCase } from "../use-cases/FileToMp3UserCase";
import { FilesToMp3UserCase } from "../use-cases/FilesToMp3UserCase";

function numVal(
  val?: string | number | undefined,
  defValue = undefined,
): number {
  return Number(val) > 0 ? Number(val) : defValue;
}

@Controller()
@ApiTags("Transformer")
export class TransformerController {
  constructor(
    private epubToStoryUC: EpubToStoryUseCase,
    private storyToMp3UC: StoryToMp3UseCase,
    private storyToEpubUC: StoryToEpubUseCase,
    private epubToMp3UC: EpubToMp3UseCase,
    private epubsToMp3UC: EpubsToMp3UseCase,
    private getEpubFilesUC: GetFilesUseCase,
    private textToMp3UserCase: TextToMp3UserCase,
    private fileToMp3UserCase: FileToMp3UserCase,
    private filesToMp3UserCase: FilesToMp3UserCase,
  ) {}

  @Post("api/transformer/epub-to-story")
  epubToStory(@Body() payload: EpubToStoryPayload) {
    return this.epubToStoryUC.execute(payload.inputFile);
  }

  @Post("api/transformer/story-to-mp3")
  storyToMp3(
    @Body()
    payload: StoryToMp3Payload,
  ) {
    const fromChapter = numVal(payload.fromChapter, 1);
    const toChapter = numVal(payload.toChapter, 10000);
    const tempo = numVal(payload.tempo, undefined);
    const splitPerFolder = numVal(payload.splitPerFolder, undefined);

    return this.storyToMp3UC.execute(payload.story, {
      fromChapter,
      toChapter,
      tempo,
      splitPerFolder,
    });
  }

  @Post("api/transformer/story-to-epub")
  storyToEpub(@Body() payload: StoryToEpubPayload) {
    const chapPerFile = numVal(payload.chapPerFile, 100);
    return this.storyToEpubUC.execute(payload.story, chapPerFile);
  }

  @Post("api/transformer/epub-to-mp3")
  epubToMp3(@Body() payload: EpubToMp3Payload) {
    return this.epubToMp3UC.execute(payload.inputFile);
  }

  @Post("api/transformer/epubs-to-mp3")
  epubsToMp3(@Body() payload: { inputFiles: string[] }) {
    return this.epubsToMp3UC.execute(payload.inputFiles);
  }

  @Post("api/transformer/text-to-mp3")
  textToMp3(@Body() payload: { text: string; lang?: string }) {
    const { text, lang } = payload;
    return this.textToMp3UserCase.execute(text, { lang });
  }

  @Post("api/transformer/file-to-mp3")
  @UseInterceptors(FileInterceptor("file"))
  fileToMp3(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: { lang?: string },
  ) {
    return this.fileToMp3UserCase.execute(file, payload.lang || "en");
  }

  @Post("api/transformer/files-to-mp3")
  @UseInterceptors(AnyFilesInterceptor())
  filesToMp3(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() payload: { lang?: string },
  ) {
    console.log(files);
    return this.filesToMp3UserCase.execute(files, payload.lang || "en");
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

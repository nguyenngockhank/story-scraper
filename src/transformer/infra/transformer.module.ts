import { Module } from "@nestjs/common";
import { EpubToStoryUseCase } from "../use-cases/EpubToStoryUseCase";
import { transformerItems } from "../domain/TransformerContainer";
import { EpubReaderImpl } from "./EpubReaderImpl";
import { TransformerImpl } from "./transformer/TransformerImpl";
import { TransformerController } from "./transformer.controller";
import { StoryModule } from "../../Story/infra/story.module";
import { StoryToMp3UseCase } from "../use-cases/StoryToMp3UseCase";
import { StoryToEpubUseCase } from "../use-cases/StoryToEpubUseCase";
import { EpubToMp3UseCase } from "../use-cases/EpubToMp3UseCase";
import { GetFilesUseCase } from "../use-cases/GetFilesUseCase";
import { EpubsToMp3UseCase } from "../use-cases/EpubsToMp3UseCase";

@Module({
  controllers: [TransformerController],
  imports: [StoryModule],
  providers: [
    // use cases
    EpubToStoryUseCase,
    StoryToMp3UseCase,
    StoryToEpubUseCase,
    EpubToMp3UseCase,
    EpubsToMp3UseCase,
    GetFilesUseCase,

    // domain & infra
    {
      provide: transformerItems.EpubReader,
      useClass: EpubReaderImpl,
    },
    {
      provide: transformerItems.Transformer,
      useClass: TransformerImpl,
    },
  ],
})
export class TransformerModule {}

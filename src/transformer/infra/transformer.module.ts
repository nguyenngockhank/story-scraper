import { Module } from "@nestjs/common";
import { EpubToStoryUseCase } from "../use-cases/EpubToStoryUseCase";
import { transformerItems } from "../domain/TransformerContainer";
import { EpubReaderImpl } from "./EpubReaderImpl";
import { TransformerImpl } from "./transformer/TransformerImpl";
import { TransformerController } from "./transformer.controller";
import { StoryModule } from "../../story/infra/story.module";
import { StoryToMp3UseCase } from "../use-cases/StoryToMp3UseCase";
import { EpubToMp3UseCase } from "../use-cases/EpubToMp3UseCase";

@Module({
  controllers: [TransformerController],
  imports: [StoryModule],
  providers: [
    // use cases
    EpubToStoryUseCase,
    StoryToMp3UseCase,
    EpubToMp3UseCase,

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

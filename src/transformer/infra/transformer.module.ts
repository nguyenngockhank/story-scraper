import { Module } from "@nestjs/common";
import { EpubToStoryUseCase } from "../use-cases/EpubToStoryUseCase";
import { transformerItems } from "../domain/TransformerContainer";
import { EpubReaderImpl } from "./EpubReaderImpl";
import { TransformerImpl } from "./TransformerImpl";
import { TransformerController } from "./transformer.controller";
import { StoryModule } from "../../story/infra/story.module";

@Module({
  controllers: [TransformerController],
  imports: [StoryModule],
  providers: [
    // use cases
    EpubToStoryUseCase,
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

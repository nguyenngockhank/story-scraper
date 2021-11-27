import { Global, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FootballModule } from "./football/infra/football.module";
import { TransformerModule } from "./transformer/infra/transformer.module";
import { appItems } from "./shared/domain/AppContainer";
import { NedbDatastoreFactory } from "./shared/infra/Datastore/NedbDatastoreFactory";
import { AxiosScraper } from "./shared/infra/Scraper/AxiosScraper";
import { Finder } from "./shared/domain/Finder";
import { DownloaderImpl } from "./shared/infra/DownloaderImpl";
import { Mp3ProcessorImpl } from "./shared/infra/Mp3Processor/Mp3ProcessorImpl";

@Global()
@Module({
  imports: [FootballModule, TransformerModule],
  controllers: [AppController],
  providers: [
    AppService,
    NedbDatastoreFactory,
    Finder,
    {
      provide: appItems.Scraper,
      useClass: AxiosScraper,
    },
    {
      provide: appItems.Downloader,
      useClass: DownloaderImpl,
    },
    {
      provide: appItems.Mp3Processor,
      useClass: Mp3ProcessorImpl,
    },
  ],
  exports: [
    NedbDatastoreFactory,
    Finder,
    {
      provide: appItems.Scraper,
      useClass: AxiosScraper,
    },
    {
      provide: appItems.Downloader,
      useClass: DownloaderImpl,
    },
    {
      provide: appItems.Mp3Processor,
      useClass: Mp3ProcessorImpl,
    },
  ],
})
export class AppModule {}

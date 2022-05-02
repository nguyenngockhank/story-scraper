import { Global, Module } from "@nestjs/common";
import { TransformerModule } from "./Transformer/infra/transformer.module";
import { appItems } from "./Shared/domain/AppContainer";
import { NedbDatastoreFactory } from "./Shared/infra/Datastore/NedbDatastoreFactory";
import { AxiosScraper } from "./Shared/infra/Scraper/AxiosScraper";
import { Finder } from "./Shared/domain/Finder";
import { DownloaderImpl } from "./Shared/infra/DownloaderImpl";
import { Mp3ProcessorImpl } from "./Shared/infra/Mp3Processor/Mp3ProcessorImpl";
import { PuppeteerScraper } from "./Shared/infra/Scraper/PuppeteerScraper";

@Global()
@Module({
  imports: [TransformerModule],
  providers: [
    NedbDatastoreFactory,
    Finder,
    {
      provide: appItems.Scraper,
      useClass: AxiosScraper,
    },
    {
      provide: appItems.AxiosScraper,
      useClass: AxiosScraper,
    },
    {
      provide: appItems.PuppeteerScraper,
      useClass: PuppeteerScraper,
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
      provide: appItems.AxiosScraper,
      useClass: AxiosScraper,
    },
    {
      provide: appItems.PuppeteerScraper,
      useClass: PuppeteerScraper,
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

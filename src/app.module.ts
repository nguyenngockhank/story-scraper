import { Global, Module } from "@nestjs/common";
import { FootballModule } from "./football/infra/football.module";
import { TransformerModule } from "./Transformer/infra/transformer.module";
import { appItems } from "./Shared/domain/AppContainer";
import { NedbDatastoreFactory } from "./Shared/infra/Datastore/NedbDatastoreFactory";
import { AxiosScraper } from "./Shared/infra/Scraper/AxiosScraper";
import { Finder } from "./Shared/domain/Finder";
import { DownloaderImpl } from "./Shared/infra/DownloaderImpl";
import { Mp3ProcessorImpl } from "./Shared/infra/Mp3Processor/Mp3ProcessorImpl";
import { WalletModule } from "./Wallet/infra/wallet.module";

@Global()
@Module({
  imports: [FootballModule, TransformerModule, WalletModule],
  providers: [
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

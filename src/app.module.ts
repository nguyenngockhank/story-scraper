import { Global, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FootballModule } from "./football/infra/football.module";
import { appItems } from "./shared/domain/AppContainer";
import { NedbDatastoreFactory } from "./shared/infra/Datastore/NedbDatastoreFactory";
import { AxiosScraper } from "./shared/infra/Scraper/AxiosScraper";

@Global()
@Module({
  imports: [FootballModule],
  controllers: [AppController],
  providers: [
    AppService,
    NedbDatastoreFactory,
    {
      provide: appItems.Scraper,
      useClass: AxiosScraper,
    },
  ],
  exports: [
    NedbDatastoreFactory,
    {
      provide: appItems.Scraper,
      useClass: AxiosScraper,
    },
  ],
})
export class AppModule {}

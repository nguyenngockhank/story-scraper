import { Injectable } from "../../Shared/domain/AppContainer";
import { NedbDatastoreFactory } from "../../Shared/infra/Datastore/NedbDatastoreFactory";
import { Chapter } from "../domain/Chapter";
import { ChapterContent } from "../domain/ChapterContent";
import { StoryRepository } from "../domain/StoryRepository";

@Injectable()
export class NedbStoryRepository implements StoryRepository {
  constructor(private datastoreFactory: NedbDatastoreFactory) {}
  isStoryExists(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async getChapterList(story: string): Promise<Chapter[]> {
    const dataStore = this.datastoreFactory.create<Chapter>({
      path: `db/${story}/chapters`,
    });
    const chapters = await dataStore.findAll();
    chapters.sort((a, b) => {
      return a.index < b.index ? -1 : 1;
    });
    return chapters;
  }

  async saveChapterList(story: string, chapters: Chapter[]): Promise<void> {
    const dataStore = this.datastoreFactory.create<Chapter>({
      path: `db/${story}/chapters`,
    });
    await dataStore.insert(chapters);
  }

  async getChapterContent(
    story: string,
    index: number | string,
  ): Promise<ChapterContent> {
    const dataStore = this.datastoreFactory.create<ChapterContent>({
      path: `db/${story}/chapter-${index}`,
    });
    const result = await dataStore.findFirst({ index: Number(index) });
    return <ChapterContent>result;
  }

  async saveChapterContent(
    story: string,
    chapterContent: ChapterContent,
  ): Promise<void> {
    const dataStore = this.datastoreFactory.create<ChapterContent>({
      path: `db/${story}/chapter-${chapterContent.index}`,
    });
    await dataStore.insert(chapterContent);
  }
}

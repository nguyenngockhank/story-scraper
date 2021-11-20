import { Injectable } from "../../../shared/domain/AppContainer";
import { MyDatastore } from "../../../shared/infra/Datastore/MyDatastore";
import { NedbDatastoreFactory } from "../../../shared/infra/Datastore/NedbDatastoreFactory";
import { BriefPost, Post } from "../../domain/Post";
import { PostRepository } from "../../domain/PostRepository";
import { getTodayString } from "./getTodayString";

@Injectable()
export class NedbPostRepository implements PostRepository {
  private mydb: MyDatastore<Post>;

  constructor(nedbFactory: NedbDatastoreFactory) {
    const datastore = nedbFactory.create<Post>({
      path: `football/posts/${getTodayString()}`,
    });
    datastore._nedb.ensureIndex({ fieldName: "url", unique: true });
    this.mydb = datastore;
  }

  async storeBriefPosts(posts: BriefPost[]): Promise<void> {
    await this.mydb.insert(posts);
  }

  async latestNews(): Promise<BriefPost[]> {
    const records = await this.mydb.findAll();
    return records;
  }

  postDetail(postUrl: string | BriefPost): Promise<Post> {
    throw new Error("Method not implemented.");
  }
}

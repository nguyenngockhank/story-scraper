import { Injectable, Inject } from "../../Shared/domain/AppContainer";
import { footballItems } from "../domain/FootballContainer";
import { BriefPost } from "../domain/Post";
import { PostRepository } from "../domain/PostRepository";

@Injectable()
export class PostsLatestGetUseCase {
  constructor(
    @Inject(footballItems.PostRepository)
    private postRepo: PostRepository,
  ) {}

  execute(): Promise<BriefPost[]> {
    return this.postRepo.latestNews();
  }
}

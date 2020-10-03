import { EntityRepository, Repository } from "typeorm";
import { MediaType, Post } from "../entity/Post";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
	createAndSave(chatId: number, fileId: string, fileType: MediaType) {
		const post = new Post();
		post.chatID = chatId;
		post.type = fileType;
		post.fileId = fileId;
		return this.manager.save(post);
    }
}

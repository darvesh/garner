import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

export enum MediaType {
	VIDEO = "video",
	GIF = "gif",
	IMAGE = "image"
}
export enum PostStatus {
	PENDING = "pending",
	POSTED = "posted",
	DISCARDED = "discarded"
}

@Entity("post")
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	type: MediaType;

	@Column({
		default: PostStatus.PENDING
	})
	status: PostStatus;

	@Column()
	fileId: string;

	@ManyToOne(type => User, user => user.id)
	chatID: number;
}

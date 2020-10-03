import "reflect-metadata";
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("user")
export class User {
	@PrimaryColumn()
	id: number; //ctx.from.id

	@Column()
	valid: boolean;

	@Column({ default: () => "current_timestamp" })
	date: string;

	@Column({
		default: () => 0
	})
	count: number;
}

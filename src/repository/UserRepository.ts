import { EntityRepository, Repository } from "typeorm";
import dayjs from "dayjs";

import { User } from "../entity/User";
import { CustomError } from "../utils";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	async createAndSave(id: number, valid = true) {
		try {
			const user = new User();
			user.id = id;
			user.valid = valid;
			user.firstPostTime = dayjs().unix();
			const result = await this.manager.save(user);
			return result;
		} catch (error) {
			throw new CustomError(
				"Slow down. Your previous post hasn't been submitted, please try again.",
				true
			);
		}
	}
	updateUser(id: number, count: number, valid: boolean) {
		return this.manager.update(User, id, { valid, count });
	}
	updateValid(id: number, valid: boolean) {
		return this.manager.update(User, id, { valid });
	}
	resetLimit(id: number) {
		const firstPostTime = dayjs().unix();
		return this.manager.update(User, id, { firstPostTime, count: 0 });
	}
}

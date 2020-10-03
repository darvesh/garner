import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
	createAndSave(id: number, valid = true) {
		const user = new User();
		user.id = id;
		user.valid = valid;
		return this.manager.save(user);
	}
	updateUser(id: number, count: number, valid: boolean) {
		return this.manager.update(User, id, { valid, count });
	}
	updateValid(id: number, valid: boolean) {
		return this.manager.update(User, id, { valid });
	}
	resetLimit(id: number) {
		const date = new Date().getTime().toString();
		return this.manager.update(User, id, { date, count: 0 });
	}
}

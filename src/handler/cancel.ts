import type { Connection } from "typeorm";
import type { TelegrafContext } from "telegraf/typings/context";

import { brokeTheBot, logError } from "../utils";
import { UserRepository } from "../repository/UserRepository";

export const cancelHandler = async (
	ctx: TelegrafContext,
	connection: Connection
) => {
	try {
		const userRepository = connection.getCustomRepository(UserRepository);
		const chatId = ctx.from?.id ?? 0;
		const user = await userRepository.findOne({
			id: chatId,
			valid: true
		});
		if (!user) return;
		await userRepository.updateValid(chatId, false);
		return ctx.reply("Submission cancelled.");
	} catch (error) {
		logError(error.message);
		brokeTheBot(ctx);
	}
};

import type { Connection } from "typeorm";
import type { TelegrafContext } from "telegraf/typings/context";

import { brokeTheBot, logError } from "../../utils";
import { UserRepository } from "../../repository/UserRepository";

export const startHandler = async (
	ctx: TelegrafContext,
	connection: Connection
) => {
	try {
		const userRepository = connection.getCustomRepository(UserRepository);
        const chatId = ctx.from?.id ?? 0;
        ctx.reply(
			"A bot to share screenshot of shit devs say you come across. If it's good, I'll post it on the channel \
        Send /submit followed by the file you want to share"
		);
		const user = await userRepository.findOne({
			id: chatId,
			valid: true
		});
		if (!user) await userRepository.createAndSave(chatId, true);
	} catch (error) {
		logError(error.message);
		brokeTheBot(ctx, undefined, error.message);
	}
};

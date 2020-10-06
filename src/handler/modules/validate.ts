import type { Connection } from "typeorm";
import type { TelegrafContext } from "telegraf/typings/context";

import dayjs from "dayjs";

import { POST_LIMIT, TIME_LIMIT } from "../../config/config";
import { brokeTheBot, CustomError, logError } from "../../utils";
import { UserRepository } from "../../repository/UserRepository";

export const validateHandler = async (
	ctx: TelegrafContext,
	connection: Connection
) => {
	try {
		const userRepository = connection.getCustomRepository(UserRepository);
		const chatId = ctx.from?.id ?? 0;
		const user = await userRepository.findOne(chatId);
		if (!user) {
			// if user doesn't exist on the db, create it
			await userRepository.createAndSave(chatId, true);
			return ctx.reply("You may now send the file now", {
				reply_to_message_id: ctx.message?.message_id
			});
		}
		const timeLeft = dayjs().diff(dayjs.unix(user.firstPostTime), "minute");

		//check if user already exceeded POST_LIMIT within TIME_LIMIT
		if (timeLeft < TIME_LIMIT && user.count > POST_LIMIT) {
			return ctx.reply(
				`Please wait ${
					TIME_LIMIT - timeLeft + 1
				} minute(s) for the next submission. Thanks.`,
				{
					reply_to_message_id: ctx.message?.message_id
				}
			);
		}
		//if TIME_LIMIT is over, just reset firstPostTime and count of the user
		if (timeLeft > 0) await userRepository.resetLimit(chatId);

		await userRepository.updateValid(chatId, true);
		return ctx.reply("Now you may send the file.", {
			reply_to_message_id: ctx.message?.message_id
		});
	} catch (error) {
		const err = error as CustomError;
		logError(error.message);
		brokeTheBot(ctx, err?.isTimeout, err.message);
	}
};

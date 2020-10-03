import type { TelegrafContext } from "telegraf/typings/context";
import type { Connection } from "typeorm";

import { Markup } from "telegraf";

import { UserRepository } from "../repository/UserRepository";
import { brokeTheBot, logError } from "../utils";
import { OWNER_ID, POST_LIMIT } from "../config/config";
import { PostRepository } from "../repository/PostRepository";
import { MediaType, PostStatus } from "../entity/Post";

export const postHandler = async (
	ctx: TelegrafContext,
	connection: Connection
) => {
	try {
		const chatId = ctx.from?.id ?? 0;
		console.log(ctx.message);
		const imageId = ctx.message?.photo?.[0].file_id ?? "";
		const userRepository = connection.getCustomRepository(UserRepository);
		const postRepositry = connection.getCustomRepository(PostRepository);

		const user = await userRepository.findOne(chatId);
		if (!user || !user.valid) return;

		await userRepository.updateUser(chatId, user.count + 1, false);
		const post = await postRepositry.createAndSave(
			chatId,
			imageId,
			MediaType.IMAGE
		);
		const keyboard = [
			[
				Markup.callbackButton(
					"Discard",
					JSON.stringify({
						id: post.id,
						status: PostStatus.DISCARDED
					})
				),
				Markup.callbackButton(
					"Post",
					JSON.stringify({ id: post.id, status: PostStatus.POSTED })
				)
			]
		];

		await ctx.telegram.sendPhoto(OWNER_ID, imageId, {
			reply_markup: { inline_keyboard: keyboard }
		});

		return ctx.telegram.sendMessage(
			chatId,
			"Thank you. You will know if it's posted"
		);
	} catch (error) {
		logError(error.message);
		brokeTheBot(ctx);
	}
};

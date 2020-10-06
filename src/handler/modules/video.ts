import type { TelegrafContext } from "telegraf/typings/context";
import type { Connection } from "typeorm";

import { Markup } from "telegraf";

import { UserRepository } from "../../repository/UserRepository";
import { brokeTheBot, logError } from "../../utils";
import { OWNER_ID } from "../../config/config";
import { PostRepository } from "../../repository/PostRepository";
import { MediaType, PostStatus } from "../../entity/Post";

export const videoHandler = async (
	ctx: TelegrafContext,
	connection: Connection
) => {
	try {
		const chatId = ctx.from?.id ?? 0;
		const videoId = ctx.message?.video?.file_id ?? "";
		const userRepository = connection.getCustomRepository(UserRepository);
		const postRepositry = connection.getCustomRepository(PostRepository);

		const user = await userRepository.findOne(chatId);
		if (!user || !user.valid) return;

		await userRepository.updateUser(chatId, user.count + 1, false);
		const post = await postRepositry.createAndSave(
			chatId,
			videoId,
			MediaType.VIDEO
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

		await ctx.telegram.sendVideo(OWNER_ID, videoId, {
			reply_markup: { inline_keyboard: keyboard }
		});

		return ctx.telegram.sendMessage(
			chatId,
			"Thank you. You will know if it's posted"
		);
	} catch (error) {
		logError(error.message);
		brokeTheBot(ctx, undefined, error.message);
	}
};

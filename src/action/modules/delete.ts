import type { TelegrafContext } from "telegraf/typings/context";

import { Markup } from "telegraf";
import { Connection } from "typeorm";

import { OWNER_ID } from "../../config/config";

export const deleteAction = async (
	ctx: TelegrafContext,
	connection: Connection
) => {
	try {
		// const action = JSON.parse({})
		console.log("delete Handler");

		await ctx.answerCbQuery("hello", false);
		await ctx.editMessageCaption(
			"",
			Markup.inlineKeyboard([
				[
					Markup.callbackButton("Confirm Deletion", "italic"),
					Markup.callbackButton("Cancel Deletion", "italic")
				]
			])
		);
	} catch (error) {
		ctx.telegram.sendMessage(OWNER_ID, "hello");
	}
};

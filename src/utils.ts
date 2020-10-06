import type { TelegrafContext } from "telegraf/typings/context";

export const logError = (message: string) => {
	const now = new Date().toString();
	console.error(`${now}: ${message}`);
};

export const brokeTheBot = (
	ctx: TelegrafContext,
	isTimeout = false,
	reason: string
) => {
	//if a user sends second post before db creates user record(only applicable if user is new)
	if (isTimeout) return ctx.reply(reason);
	ctx.replyWithPhoto(
		"https://www.pinclipart.com/picdir/big/186-1867749_emotional-health-clip-art.png",

		{
			caption: "Oh no, something broke!"
		}
	);
};

export class CustomError extends Error {
	isTimeout: boolean;
	constructor(message: string, isTimeout = false) {
		super(message);
		this.isTimeout = isTimeout;
	}
}

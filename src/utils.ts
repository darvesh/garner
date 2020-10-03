import { TelegrafContext } from "telegraf/typings/context";
import { TIME_LIMIT } from "./config/config";

export const calculateTimeLeft = (time: string, now: number) =>
	Number(time) + TIME_LIMIT - now;

export const logError = (message: string) => {
	const now = new Date().toString();
	console.error(`${now}: ${message}`);
};

export const brokeTheBot = (ctx: TelegrafContext) => {
	ctx.reply("You broke the bot!");
	ctx.replyWithPhoto(
		"AgACAgUAAxkBAAED-FJfeFdG3WDxDH8I9staWJpCU1wWuAACUawxG21EyVdNptBw3ImPmskfTWx0AAMBAAMCAANtAANLswIAARsE",
		{
			caption: "Oh no, something broke!"
		}
	);
};

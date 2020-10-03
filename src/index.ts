import type { TelegrafContext } from "telegraf/typings/context";

import "reflect-metadata";
import Telegraf from "telegraf";
import { createConnection } from "typeorm";

import { TOKEN } from "./config/config";
import { postHandler } from "./handler/post";
import { validateHandler } from "./handler/validate";
import { cancelHandler } from "./handler/cancel";
import { BetterSqlite3ConnectionOptions } from "typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions";

const DBCofig: BetterSqlite3ConnectionOptions = {
	type: "better-sqlite3",
	database: __dirname + "/database.sql",
	entities: [__dirname + "/entity/*.{js,ts}"],
	synchronize: true
};

createConnection(DBCofig).then(connection => {
	const bot = new Telegraf(TOKEN);

	bot.hears("/submit", async ctx => await validateHandler(ctx, connection));
	bot.hears("/cancel", async ctx => await cancelHandler(ctx, connection));
	bot.on("message", async ctx => await postHandler(ctx, connection));

	bot.action(/.+/, async ctx => {});

	bot.command("start", ({ reply }) =>
		reply(
			"A bot to share screenshot of shit devs say you come across. If it's good, I'll post it on the channel \
        Send /screenshot followed by the image you want to share"
		)
	);

	bot.command("help", ({ reply }) =>
		reply("Send /screenshot followed by the image you want to share")
	);

	bot.catch((err: Error) => {
		const date = new Date();
		console.log(date.toString() + err.message);
	});

	bot.launch();
});

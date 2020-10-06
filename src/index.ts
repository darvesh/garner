import "reflect-metadata";
import Telegraf from "telegraf";
import { createConnection } from "typeorm";
import { BetterSqlite3ConnectionOptions } from "typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions";

import { COMMANDS, TOKEN } from "./config/config";
import { handlers } from "./handler";
import { actions } from "./action";

const DBCofig: BetterSqlite3ConnectionOptions = {
	type: "better-sqlite3",
	database: __dirname + "/database.sql",
	entities: [__dirname + "/entity/*.{js,ts}"],
	synchronize: true
	// logging: true
};

createConnection(DBCofig).then(connection => {
	const bot = new Telegraf(TOKEN);

	actions(bot, connection);
	handlers(bot, connection);

	COMMANDS.forEach(([command, message]) => {
		bot.command(command, ({ reply }) => reply(message));
	});

	bot.catch((err: Error) => {
		const date = new Date();
		console.log(date.toString() + err.message);
	});

	bot.launch();
});

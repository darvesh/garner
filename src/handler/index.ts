import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { Connection } from "typeorm";

import { startHandler } from "./modules/start";
import { validateHandler } from "./modules/validate";
import { cancelHandler } from "./modules/cancel";
import { photoHandler } from "./modules/photo";
import { videoHandler } from "./modules/video";

export const handlers = (
	bot: Telegraf<TelegrafContext>,
	connection: Connection
) => {
	bot.hears("start", async ctx => await startHandler(ctx, connection));
	bot.hears("validate", async ctx => await validateHandler(ctx, connection));
	bot.hears("cancel", async ctx => await cancelHandler(ctx, connection));
	bot.on("photo", async ctx => await photoHandler(ctx, connection));
	bot.on("video", async ctx => await videoHandler(ctx, connection));
	// bot.on("animation", async ctx => await photoHandler(ctx, connection));
};

import Telegraf, { Telegram } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { Connection } from "typeorm";

import { deleteAction } from "./modules/delete";
import { discardAction } from "./modules/discard";
import { postAction } from "./modules/post";

export const actions = async (
	bot: Telegraf<TelegrafContext>,
	connection: Connection
) => {
	bot.action(/delete=.*/, async ctx => await deleteAction(ctx, connection));
	bot.action(/post=.*/, async ctx => await postAction(ctx, connection));
	bot.action(/discard=.*/, async ctx => await discardAction(ctx, connection));
};

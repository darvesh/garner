import type { TelegrafContext } from "telegraf/typings/context";

import { Markup } from "telegraf";
import { Connection } from "typeorm";

import { OWNER_ID } from "../config/config";

export const action = async(ctx: TelegrafContext, connection: Connection) => {
    try{
        // const action = JSON.parse({})
        await ctx.answerCbQuery();
        await ctx.editMessageCaption(
            "Caption",
            Markup.inlineKeyboard([
                Markup.callbackButton("Plain", "plain"),
                Markup.callbackButton("Italic", "italic")
            ])
        );

    }catch(error){

        ctx.telegram.sendMessage(OWNER_ID, "hello");
    }
}
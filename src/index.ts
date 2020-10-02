import Telegraf, { Markup } from "telegraf";
import { TOKEN, TIME_LIMIT, OWNER_ID, POST_LIMIT } from "./config";
import Datastore from "nedb-promises";
import path from "path";
import {
	addFile,
	getLastPostDateStatus,
	getUserByID,
} from "./operations";

const bot = new Telegraf(TOKEN);
const db = Datastore.create(path.join(__dirname, "database.db"));

//create index
db.ensureIndex({ fieldName: "chatID", unique: true })
	.then(() => console.info("Index Created"))
	.catch(error => console.log(error));

bot.hears("/screenshot", async ({ from, reply }) => {
	const chatId = from?.id ?? 0;
    const { status, time: timeLeft } = await getLastPostDateStatus(db, chatId);
    console.log(status, timeLeft);
    
	if (status) return reply("Now send the image");
	return reply(
		`Please wait ${timeLeft} minute(s) for the next submission. Thanks.`
	);
});

bot.on("photo", async ctx => {
	try {
		const chatId = ctx.from?.id ?? 0;

		const user = await getUserByID(db, chatId);

		if (!user.valid)
			return ctx.reply("First send /screenshot then send the image");

		const imageId = ctx.message?.photo?.[0].file_id ?? "";

		const keyboard = [
			[
				Markup.callbackButton("Discard", "JSON.stringify(discard)"),
				Markup.callbackButton("Post", "JSON.stringify(selected)")
			]
		];

		ctx.telegram.sendPhoto(OWNER_ID, imageId, {
			reply_markup: { inline_keyboard: keyboard }
		});

		await addFile(db, chatId, imageId);

		return ctx.telegram.sendMessage(
			chatId,
			"Thank you. You will know if it's posted"
		);
	} catch (error) {
		return ctx.reply(error.message);
	}
});

bot.action(/.+/, async ctx => {
	console.log(ctx.callbackQuery?.data);
	// try{
	//     const action = JSON.parse(ctx.message.)
	//     await ctx.answerCbQuery();
	//     await ctx.editMessageCaption(
	//         "Caption",
	//         Markup.inlineKeyboard([
	//             Markup.callbackButton("Plain", "plain"),
	//             Markup.callbackButton("Italic", "italic")
	//         ])
	//     );

	// }
	return ctx.telegram.sendMessage(OWNER_ID, "hello");
});

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

import { Context } from "telegraf";

export async function handleCallbackQuery(ctx: Context) {
  if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
    const callbackData = ctx.callbackQuery.data;
    console.log("Callback data:", callbackData);

    await ctx.answerCbQuery(); // ✅ Always acknowledge the callback query


    switch (callbackData) {
      case "price_btc":
        return null;
      case "price_eth":
        return null;

      default:
        return ctx.reply("⚠️ Unknown action.");
    }
  } else {
    return ctx.reply?.("⚠️ Unable to process request. Data is undefined");
  }
}

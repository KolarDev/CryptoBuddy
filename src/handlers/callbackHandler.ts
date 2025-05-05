import { Context } from "telegraf";
import { MyContext } from "../interfaces/scenesInterface";

export async function handleCallbackQuery(ctx: MyContext) {
  await ctx.answerCbQuery(); // ✅ Always acknowledge the callback query
  // Check if callbackdata and neccessary data exists
  if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
    const callbackData = ctx.callbackQuery.data;
    console.log("Callback data:", callbackData);

    if (!ctx.chat || !ctx.from) {
      console.error("Missing chat or user information.");
      return ctx.reply?.("⚠️ Unable to process request.");
    }

    switch (callbackData) {
      case "go_convert":
        return ctx.scene.enter("convertScene"); // Start conversion process
      case "go_news":
        return ctx.reply?.("⚠️ Feature coming soon.");
      case "go_alerts":
        return ctx.reply?.("⚠️ Feature coming soon.");
      case "go_signals":
        return ctx.reply?.("⚠️ Feature coming soon.");
      case "go_settings":
        return ctx.reply?.("⚠️ Feature coming soon.");
      case "go_help":
        return ctx.reply?.("⚠️ Feature coming soon.");

      default:
        return ctx.reply("⚠️ Unknown action.");
    }
  } else {
    return ctx.reply?.("⚠️ Unable to process request. Data is undefined");
  }
}

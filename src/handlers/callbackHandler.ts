import { Context } from "telegraf";
import { handlePriceCommand } from "../services/priceService";

export async function handleCallbackQuery(ctx: Context) {
  if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
    const callbackData = ctx.callbackQuery.data;
    console.log("Callback data:", callbackData);

    const chatId = ctx.chat!.id;

    switch (callbackData) {
      case "price_btc":
        return handlePriceCommand(chatId, "BTC");

      case "price_eth":
        return handlePriceCommand(chatId, "ETH");

      default:
        return ctx.reply("⚠️ Unknown action.");
    }
  } else {
    return ctx.reply?.("⚠️ Unable to process request. Data is undefined");
  }
}

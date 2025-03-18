import { Telegraf, Context } from "telegraf";
import { handleCommand } from "./commandHandler";
import { handleMessage } from "./messageHandler";
import { handleCallbackQuery } from "./callbackHandler";

export async function handleUpdate(bot: Telegraf, update: any) {
  try {
    const ctx = new Context(update, bot.telegram, bot.botInfo!);

    if (update.message) {
      const text = update.message.text || "";
      if (text.startsWith("/")) {
        const [command, ...args] = text.substring(1).split(" ");
        return handleCommand(ctx, command, args.join(" "));
      }
      return handleMessage(ctx);
    }

    if (update.callback_query) {
      return handleCallbackQuery(ctx);
    }
  } catch (error) {
    console.error("Error in handleUpdate:", error);
  }
}

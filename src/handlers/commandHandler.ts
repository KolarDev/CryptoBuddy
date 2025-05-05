import { Context, Markup } from "telegraf";
import { registerUser } from "../services/userService";
import { MyContext } from "../interfaces/scenesInterface";

export async function handleCommand(
  ctx: MyContext,
  command: string,
  args?: string
) {
  if (!ctx.chat || !ctx.from) {
    console.error("Missing chat or user information.");
    return ctx.reply?.("⚠️ Unable to process request.");
  }

  const chatId = ctx.chat?.id;
  const userInfo = ctx.from;

  switch (command) {
    case "start":
      console.log("start command working 🖐🖐");
      await registerUser(
        chatId,
        userInfo.username ?? "",
        userInfo.first_name,
        userInfo.last_name ?? ""
      );
      return ctx.reply(
        `👋 Welcome, ${ctx.from.first_name}!\n\n` +
          `I am your Crypto Assistant Bot. Choose a feature below to get started:`,
        Markup.inlineKeyboard([
          [Markup.button.callback("💱 Coin Price", "go_convert")],
          [Markup.button.callback("📢 Crypto News", "go_news")],
          [Markup.button.callback("📈 Price Alerts", "go_alerts")],
          [Markup.button.callback("📊 Trading Signals", "go_signals")],
          [Markup.button.callback("⚙️ Settings", "go_settings")],
          [Markup.button.callback("ℹ️ Help", "go_help")],
        ])
      );
    case "convert":
      return ctx.scene.enter("convertScene"); // Start conversion process

    default:
      return ctx.reply("⚠️ Unknown command. Try /price <coin>.");
  }
}

import { Context } from "telegraf";
import { sendMessage } from "../config/axios";
import { handlePriceCommand } from "../services/priceService";
import { registerUser } from "../services/userService";

export async function handleCommand(
  ctx: Context,
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
        "👋 Welcome to CryptoBuddy! Use /price <coin> to get prices."
      );

    case "coin-price":
      return ctx.scene.enter("convertScene"); // Start conversion process

    case "convert":
      return ctx.scene.enter("convertScene"); // Start conversion process

    default:
      return ctx.reply("⚠️ Unknown command. Try /price <coin>.");
  }
}

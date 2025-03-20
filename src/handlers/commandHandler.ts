import { Context } from "telegraf";
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
        "👋 Welcome to CryptoBuddy! Use /price <coin> to get prices."
      );
    case "convert":
      return ctx.scene.enter("convertScene"); // Start conversion process

    default:
      return ctx.reply("⚠️ Unknown command. Try /price <coin>.");
  }
}

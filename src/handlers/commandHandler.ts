import { sendMessage } from "../config/axios";
import { handlePriceCommand } from "../services/priceService";
import { registerUser } from "../services/userService";

export async function handleCommand(
  chatId: number,
  command: string,
  args?: string,
  userInfo?: any
) {
  switch (command) {
    case "start":
      await registerUser(
        chatId,
        userInfo.username,
        userInfo.first_name,
        userInfo.last_name
      );
      return sendMessage(
        chatId,
        "👋 Welcome to CryptoBuddy! Use /price <coin> to get prices."
      );
    case "price":
      return handlePriceCommand(chatId, args);
    default:
      return sendMessage(chatId, "⚠️ Unknown command. Try /price <coin>.");
  }
}

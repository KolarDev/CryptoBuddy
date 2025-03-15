import { errorHandler } from "../middlewares/errorHandler";
import { handleCommand } from "./commandHandler";

export async function handleMessage(messageObj: any) {
  try {
    const messageText = messageObj.text || "";
    if (!messageText) return;

    const chatId = messageObj.chat.id;

    const userInfo = messageObj.from;

    if (messageText.startsWith("/")) {
      const [command, ...args] = messageText.substring(1).split(" ");
      return handleCommand(chatId, command, args.join(" "), userInfo);
    }

    // If not a command
    return;
  } catch (error) {
    errorHandler(error, "handleMessage");
  }
}

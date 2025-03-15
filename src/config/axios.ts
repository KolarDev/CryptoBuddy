import axios from "axios";
import { config } from "./envSchema";

const TELEGRAM_API = `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/`;

export const axiosInstance = axios.create({
  baseURL: TELEGRAM_API,
});

export async function sendMessage(chatId: number, messageText: string) {
  try {
    await axiosInstance.get("sendMessage", {
      params: {
        chat_id: chatId,
        text: messageText,
      },
    });
  } catch (error) {
    throw new Error(`Failed to send message: ${error}`);
  }
}

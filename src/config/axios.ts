import axios from "axios";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/`;

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

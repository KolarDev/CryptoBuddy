import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, {
  webHook: { port: Number(process.env.PORT) || 3000 },
});

// Set webhook URL
bot.setWebHook(`${process.env.WEBHOOK_URL}/webhook`);

export default bot;

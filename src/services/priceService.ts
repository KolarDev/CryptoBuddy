import axios from "axios";
import { sendMessage } from "../config/axios";
import { errorHandler } from "../middlewares/errorHandler";

export async function handlePriceCommand(chatId: number, coin?: string) {
  if (!coin) {
    return sendMessage(
      chatId,
      "⚡ Please provide a coin symbol, e.g., `/price btc`"
    );
  }

  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
    );

    if (!data[coin]) {
      return sendMessage(chatId, "❌ Invalid coin symbol. Try /price btc");
    }

    const price = data[coin].usd;
    sendMessage(chatId, `💰 ${coin.toUpperCase()} Price: *$${price}*`);
  } catch (error) {
    errorHandler(error, "handlePriceCommand");
  }
}

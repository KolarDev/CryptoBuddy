import { PriceAlert } from "../models/priceAlert";
import { Subscription } from "../models/subscribe";

/**
 * Saves a new price alert to the database.
 * @param chatId The Telegram user's chat ID.
 * @param coinSymbol The coin symbol (e.g., 'BTC').
 * @param targetPrice The target price (e.g., 60000).
 * @param alertType The type of alert ('RISE' or 'FALL').
 * @returns The saved PriceAlert document.
 */
export async function savePriceAlert(
  chatId: number,
  coinSymbol: string,
  targetPrice: number,
  alertType: "RISE" | "FALL"
) {
  try {
    const newAlert = await PriceAlert.create({
      chatId,
      coinSymbol,
      targetPrice,
      alertType,
      status: "ACTIVE",
    });
    const subscribed = await Subscription.findOne({ chatId });
    if (subscribed) {
      if (!subscribed.types.includes("price_alerts")) {
        subscribed.types.push("price_alerts");
        await subscribed.save();
      }
    } else {
      await Subscription.create({
        chatId,
        types: ["price_alerts"],
      });
    }
    console.log(`💰 New alert created for ${coinSymbol} by chat ${chatId}`);
    return newAlert;

  } catch (error) {
    console.error("❌ Failed to save price alert:", error);
    // You might want to throw the error or return a specific error object
    throw new Error("Could not save the price alert to the database.");
  }
}
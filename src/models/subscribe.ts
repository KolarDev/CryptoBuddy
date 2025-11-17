import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  chatId: { type: Number, required: true, unique: true },
  types: {
    type: [String],
    enum: ["crypto_news", "price_alerts", "trading_signals"],
    default: [],
  },
  subscribedAt: { type: Date, default: Date.now },
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);

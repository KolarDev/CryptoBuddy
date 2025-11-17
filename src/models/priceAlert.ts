import mongoose from "mongoose";

const priceAlertSchema = new mongoose.Schema({
  // Link to the user who set the alert
  chatId: {
    type: Number,
    required: true,
    index: true, // Index for faster lookup by user
  },

  // The symbol of the cryptocurrency (e.g., 'BTC')
  coinSymbol: {
    type: String,
    required: true,
    uppercase: true,
  },

  // The price threshold for the alert (e.g., 60000)
  targetPrice: {
    type: Number,
    required: true,
  },

  // The condition that triggers the alert ('RISE' or 'FALL')
  alertType: {
    type: String,
    enum: ["RISE", "FALL"],
    required: true,
  },

  // Status of the alert
  status: {
    type: String,
    enum: ["ACTIVE", "TRIGGERED", "CANCELLED"],
    default: "ACTIVE",
  },

  // Timestamp when the alert was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const PriceAlert = mongoose.model("PriceAlert", priceAlertSchema);
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const subscriptionSchema = new mongoose_1.default.Schema({
    chatId: { type: Number, required: true, unique: true },
    types: {
        type: [String],
        enum: ["crypto_news", "price_alerts", "trading_signals"],
        default: [],
    },
    subscribedAt: { type: Date, default: Date.now },
});
exports.Subscription = mongoose_1.default.model("Subscription", subscriptionSchema);

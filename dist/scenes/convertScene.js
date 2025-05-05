"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertScene = void 0;
const telegraf_1 = require("telegraf");
const priceService_1 = require("../services/priceService");
// Create a composer to manage handlers
const step1 = new telegraf_1.Composer();
const step2 = new telegraf_1.Composer();
const step3 = new telegraf_1.Composer();
const step4 = new telegraf_1.Composer();
// Step 1: Ask user for the cryptocurrency they have
step1.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("📌 ctx.scene.session:", ctx.scene.session);
    ctx.scene.session.fromCoin = ctx.message.text.toUpperCase();
    yield ctx.reply(`✅ Got it! Now enter the amount of ${ctx.scene.session.fromCoin}:`);
    return ctx.wizard.next();
}));
// Step 2: Ask for amount
step2.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = Number(ctx.message.text);
    if (isNaN(amount)) {
        return ctx.reply("⚠️ Please enter a valid amount.");
    }
    ctx.scene.session.amount = amount;
    // Show inline keyboard for conversion options
    yield ctx.reply("🔄 Choose how you want to convert:", telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback("💵 Convert to USD", "convert_usd")],
        [telegraf_1.Markup.button.callback("🔄 Convert to Other Coins", "convert_crypto")],
    ]));
    return ctx.wizard.next();
}));
step3.on("callback_query", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery(); // Acknowledge button click
    const cbq = ctx.callbackQuery;
    if ("data" in cbq) {
        const callbackData = cbq.data;
        console.log("Callback Data:", callbackData);
        const fromCoin = ctx.scene.session.fromCoin;
        const amount = ctx.scene.session.amount;
        // Perform next action based on callback data
        if (callbackData === "convert_usd") {
            ctx.scene.session.toCoin = "USD";
            const fromCoin = ctx.scene.session.fromCoin;
            const amount = ctx.scene.session.amount;
            const toCoin = ctx.scene.session.toCoin;
            // Ensure fromCoin and amount exist before using them
            if (!fromCoin || !amount) {
                yield ctx.reply("❌ Conversion failed. Session data is missing. Please restart.");
                return ctx.scene.leave();
            }
            console.log(`fromCoin ${fromCoin} toCoin ${toCoin} amount ${amount}`);
            const { price, error } = yield (0, priceService_1.getCryptoPrice)(fromCoin, "USD");
            if (error) {
                yield ctx.reply(error);
                return ctx.scene.leave();
            }
            if (price === null) {
                yield ctx.reply("Unable to get the price. Check the coin symbols and try again.");
                return ctx.scene.leave();
            }
            const result = (amount * price).toFixed(2);
            yield ctx.reply(`✅ ${amount} ${fromCoin} is **${result} USD** 💱`);
            return ctx.scene.leave();
        }
        else if (callbackData === "convert_crypto") {
            yield ctx.reply("💱 Enter the coin you want to convert to (e.g., USDT, BNB):");
            return ctx.wizard.next();
        }
        // Respond error message if there is no callbackdata
    }
    else {
        return ctx.reply("⚠️ Error! No callback data.");
    }
}));
// Step 4: Handle conversion to another crypto
step4.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.scene.session.toCoin = ctx.message.text.toUpperCase();
    const fromCoin = ctx.scene.session.fromCoin;
    const amount = ctx.scene.session.amount;
    const toCoin = ctx.scene.session.toCoin;
    if (!fromCoin || !amount) {
        yield ctx.reply("❌ Conversion failed. Missing session data.");
        return ctx.scene.leave();
    }
    const { price, error } = yield (0, priceService_1.getCryptoPrice)(fromCoin, toCoin);
    if (error) {
        yield ctx.reply(error);
        return ctx.scene.leave();
    }
    if (price === null) {
        yield ctx.reply("Unable to get the price. Check the coin symbols and try again.");
        return ctx.scene.leave();
    }
    const result = (amount * price).toFixed(2);
    yield ctx.reply(`✅ ${amount} ${fromCoin} = **${result} ${toCoin}** 💱`);
    return ctx.scene.leave();
}));
// Create the scene using the composers
exports.convertScene = new telegraf_1.Scenes.WizardScene("convertScene", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("💰 Enter the coin you have (e.g., BTC, ETH):");
    return ctx.wizard.next();
}), step1, // Handles input for "fromCoin"
step2, // Handles input for "amount"
step3, // Handles conversion selection (USD or Other Coins)
step4 // Handles input for "toCoin" if not USD
);

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
// Step composers
const step1 = new telegraf_1.Composer();
const step2 = new telegraf_1.Composer();
const step3 = new telegraf_1.Composer();
const step4 = new telegraf_1.Composer();
// Step 1: Ask user for the cryptocurrency they have
step1.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.scene.session.fromCoin = ctx.message.text.toUpperCase();
    yield ctx.reply(`✅ Got it! Now enter the amount of ${ctx.scene.session.fromCoin}:`);
    return ctx.wizard.next();
}));
// Step 2: Ask for amount and show conversion options
step2.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = Number(ctx.message.text);
    if (isNaN(amount)) {
        return ctx.reply("⚠️ Please enter a valid amount.");
    }
    ctx.scene.session.amount = amount;
    yield ctx.reply("🔄 Choose how you want to convert:", telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback("💵 Convert to USD", "convert_usd")],
        [telegraf_1.Markup.button.callback("🔄 Convert to Other Coins", "convert_crypto")],
    ]));
    return ctx.wizard.next();
}));
// Step 3: Handle conversion type choice
step3.on("callback_query", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const choice = ctx.callbackQuery.data;
    yield ctx.answerCbQuery();
    if (!ctx.scene.session.fromCoin || !ctx.scene.session.amount) {
        yield ctx.reply("❌ Conversion failed. Missing session data.");
        return ctx.scene.leave();
    }
    if (choice === "convert_usd") {
        const fromCoin = ctx.scene.session.fromCoin;
        const price = yield (0, priceService_1.getCryptoPrice)(fromCoin, "USD");
        if (!price) {
            yield ctx.reply("❌ Conversion failed. Invalid coin symbol.");
            return ctx.scene.leave();
        }
        const result = (ctx.scene.session.amount * price).toFixed(2);
        yield ctx.reply(`✅ ${ctx.scene.session.amount} ${ctx.scene.session.fromCoin} = **${result} USD** 💱`);
        return ctx.scene.leave();
    }
    if (choice === "convert_crypto") {
        yield ctx.reply("💱 Enter the coin you want to convert to (e.g., USDT, BNB):");
        return ctx.wizard.next();
    }
    yield ctx.reply("❌ Unknown action.");
}));
// Step 4: Handle conversion to another crypto
step4.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.scene.session.toCoin = ctx.message.text.toUpperCase();
    const fromCoin = ctx.scene.session.fromCoin;
    const toCoin = ctx.scene.session.toCoin;
    const amount = ctx.scene.session.amount;
    if (!fromCoin || !amount) {
        yield ctx.reply("❌ Conversion failed. Missing session data.");
        return ctx.scene.leave();
    }
    // Convert the crypto price based on the provided inputs
    const price = yield (0, priceService_1.getCryptoPrice)(fromCoin, toCoin);
    if (!price) {
        yield ctx.reply("❌ Conversion failed. Invalid coin symbol.");
        return ctx.scene.leave();
    }
    const result = (amount * price).toFixed(2);
    yield ctx.reply(`✅ ${amount} ${fromCoin} = **${result} ${toCoin}** 💱`);
    return ctx.scene.leave();
}));
// Create the Wizard Scene
exports.convertScene = new telegraf_1.Scenes.WizardScene("convertScene", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("💰 Enter the coin you have (e.g., BTC, ETH):");
    return ctx.wizard.next();
}), step1, step2, step3, step4);

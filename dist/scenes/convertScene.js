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
    ctx.session.data.fromCoin = ctx.message.text.toUpperCase();
    yield ctx.reply(`✅ Got it! Now enter the amount of ${ctx.session.data.fromCoin}:`);
    return ctx.wizard.next();
}));
// Step 2: Ask for amount
step2.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = Number(ctx.message.text);
    if (isNaN(amount)) {
        return ctx.reply("⚠️ Please enter a valid amount.");
    }
    ctx.session.data.amount = amount;
    // Show inline keyboard for conversion options
    yield ctx.reply("🔄 Choose how you want to convert:", telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback("💵 Convert to USD", "convert_usd")],
        [telegraf_1.Markup.button.callback("🔄 Convert to Other Coins", "convert_crypto")],
    ]));
}));
// Step 3: Handle conversion to USD
step3.action("convert_usd", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery();
    ctx.session.data.toCoin = "USD";
    const price = yield (0, priceService_1.getCryptoPrice)(ctx.session.data.fromCoin, "USD");
    if (!price) {
        yield ctx.reply("❌ Conversion failed. Check coin symbols and try again.");
        return ctx.scene.leave();
    }
    const convertedAmount = (ctx.session.data.amount * price).toFixed(2);
    yield ctx.reply(`✅ ${ctx.session.data.amount} ${ctx.session.data.fromCoin} is **${convertedAmount} USD** 💱`);
    return ctx.scene.leave();
}));
// Step 4: Ask user for target currency if not converting to USD
step3.action("convert_crypto", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.answerCbQuery();
    yield ctx.reply("💱 Enter the coin you want to convert to (e.g., USDT, BNB):");
    return ctx.wizard.next();
}));
// Step 5: Handle target currency input and perform conversion
step4.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session.data.toCoin = ctx.message.text.toUpperCase();
    const price = yield (0, priceService_1.getCryptoPrice)(ctx.session.data.fromCoin, ctx.session.data.toCoin);
    if (!price) {
        yield ctx.reply("❌ Conversion failed. Check coin symbols and try again.");
        return ctx.scene.leave();
    }
    const convertedAmount = (ctx.session.data.amount * price).toFixed(2);
    yield ctx.reply(`✅ ${ctx.session.data.amount} ${ctx.session.data.fromCoin} is **${convertedAmount} ${ctx.session.data.toCoin}** 💱`);
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
// import { Markup, Scenes } from "telegraf";
// import { getCryptoPrice } from "../services/priceService";
// import { ConvertSceneSession, MyContext } from "../interfaces/scenesInterface";
// export const convertScene = new Scenes.WizardScene<
//   MyContext<ConvertSceneSession>
// >(
//   "convertScene",
//   async (ctx) => {
//     await ctx.reply("💰 Enter the coin you have (e.g., BTC, ETH):");
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     if (!ctx.message || !("text" in ctx.message)) {
//       return ctx.reply("⚠️ Please enter a valid cryptocurrency symbol.");
//     }
//     ctx.session.data.fromCoin = ctx.message.text.toUpperCase();
//     // Ask for amount
//     await ctx.reply(
//       `✅ Got it! Now enter the amount of ${ctx.session.data.fromCoin}:`
//     );
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     if (
//       !ctx.message ||
//       !("text" in ctx.message) ||
//       isNaN(Number(ctx.message.text))
//     ) {
//       return ctx.reply("⚠️ Please enter a valid amount.");
//     }
//     ctx.session.data.amount = Number(ctx.message.text);
//     // Show inline keyboard to choose conversion type
//     await ctx.reply(
//       "🔄 Choose how you want to convert:",
//       Markup.inlineKeyboard([
//         [Markup.button.callback("💵 Convert to USD", "convert_usd")],
//         [Markup.button.callback("🔄 Convert to Other Coins", "convert_crypto")],
//       ])
//     );
//   }
// );
// // ✅ Auto-assign "USD" as target currency and proceed to conversion
// convertScene.action("convert_usd", async (ctx) => {
//   await ctx.answerCbQuery();
//   ctx.session.data.toCoin = "USD";
//   if (!ctx.session.data.fromCoin) {
//     return ctx.reply("⚠️ Please enter a valid cryptocurrency symbol.");
//   }
//   // Fetch conversion rate
//   const price = await getCryptoPrice(ctx.session.data.fromCoin, "USD");
//   if (!price) {
//     ctx.reply("❌ Conversion failed. Check coin symbols and try again.");
//     return ctx.scene.leave();
//   }
//   const convertedAmount = (ctx.session.data.amount! * price).toFixed(2);
//   ctx.reply(
//     `✅ ${ctx.session.data.amount} ${ctx.session.data.fromCoin} is **${convertedAmount} USD** 💱`
//   );
//   return ctx.scene.leave();
// });
// // 🔄 Ask user for target currency
// convertScene.action("convert_crypto", async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(
//     "💱 Enter the coin you want to convert to (e.g., USDT, BNB):"
//   );
//   return ctx.wizard.next();
// });
// // 💱 Handle user input for target currency and complete conversion
// convertScene.on("text", async (ctx) => {
//   if (!ctx.session.data.toCoin) {
//     ctx.session.data.toCoin = ctx.message.text.toUpperCase();
//   }
//   if (!ctx.session.data.fromCoin) {
//     return ctx.reply("⚠️ Please enter a valid cryptocurrency symbol.");
//   }
//   // Fetch conversion rate
//   const price = await getCryptoPrice(
//     ctx.session.data.fromCoin,
//     ctx.session.data.toCoin
//   );
//   if (!price) {
//     ctx.reply("❌ Conversion failed. Check coin symbols and try again.");
//     return ctx.scene.leave();
//   }
//   const convertedAmount = (ctx.session.data.amount! * price).toFixed(2);
//   ctx.reply(
//     `✅ ${ctx.session.data.amount} ${ctx.session.data.fromCoin} is **${convertedAmount} ${ctx.session.data.toCoin}** 💱`
//   );
//   return ctx.scene.leave();
// });

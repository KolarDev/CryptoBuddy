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
const subscriptionService_1 = require("../services/subscriptionService");
// Create a composer to manage handlers
const step1 = new telegraf_1.Composer();
const step2 = new telegraf_1.Composer();
// const step3 = new Composer<MyContext<NewsSceneSession>>();
// const step4 = new Composer<MyContext<NewsSceneSession>>();
// Step 1 – handle selected type and ask to subscribe or unsubscribe
step1.on("callback_query", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const cbq = ctx.callbackQuery;
    if ("data" in cbq) {
        const data = cbq.data;
        const type = data === "news_crypto" ? "crypto_news" : "trading_signals";
        ctx.scene.session.selectedType = type;
        yield ctx.editMessageText(`You selected *${type.replace("_", " ")}*. What would you like to do?`, Object.assign({ parse_mode: "Markdown" }, telegraf_1.Markup.inlineKeyboard([
            [telegraf_1.Markup.button.callback("✅ Subscribe", "subscribe")],
            [telegraf_1.Markup.button.callback("🚫 Unsubscribe", "unsubscribe")],
        ])));
        return ctx.wizard.next(); // Move to step 2
    }
}));
// Step 2 – subscribe/unsubscribe logic
step2.on("callback_query", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cbq = ctx.callbackQuery;
    if ("data" in cbq) {
        const action = cbq.data;
        const type = ctx.scene.session.selectedType;
        const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id;
        if (!chatId || !type) {
            return ctx.reply("❌ Something went wrong.");
        }
        if (action === "subscribe") {
            yield (0, subscriptionService_1.addSubscription)(chatId, type);
            yield ctx.editMessageText(`✅ Subscribed to *${type.replace("_", " ")}*!`, { parse_mode: "Markdown" });
        }
        else if (action === "unsubscribe") {
            yield (0, subscriptionService_1.removeSubscription)(chatId, type);
            yield ctx.editMessageText(`🚫 Unsubscribed from *${type.replace("_", " ")}*.`, { parse_mode: "Markdown" });
        }
        return ctx.scene.reenter(); // Restart the scene
    }
}));
// Create the scene using the composers
exports.convertScene = new telegraf_1.Scenes.WizardScene("newsScene", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply("📰 What type of news are you interested in?", telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback("🪙 Crypto News", "news_crypto")],
        [telegraf_1.Markup.button.callback("📈 Trading Signals", "news_trading")],
    ]));
    return ctx.wizard.next();
}), step1, // Handles
step2 // Handles
);

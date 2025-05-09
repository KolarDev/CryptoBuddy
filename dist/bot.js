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
const telegraf_1 = require("telegraf");
const envSchema_1 = require("./config/envSchema");
const convertScene_1 = require("./scenes/convertScene");
const newsScene_1 = require("./scenes/newsScene");
const messageHandler_1 = require("./handlers/messageHandler");
const commandHandler_1 = require("./handlers/commandHandler");
const validateContext_1 = require("./middlewares/validateContext");
const callbackHandler_1 = require("./handlers/callbackHandler");
// Create bot instance with the correct context type
const bot = new telegraf_1.Telegraf(envSchema_1.config.TELEGRAM_BOT_TOKEN);
// Register Scene
const stage = new telegraf_1.Scenes.Stage([convertScene_1.convertScene, newsScene_1.newsScene]);
// Middleware
bot.use((0, telegraf_1.session)()); // Enable session
bot.use(stage.middleware()); // Enable scenes
bot.use(validateContext_1.validateContext);
// Command Handler
bot.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ctx);
    if (!ctx.message || !("text" in ctx.message)) {
        return; // Ignore if the message is not a text message
    }
    const text = ctx.message.text || "";
    if (text.startsWith("/")) {
        const [command, ...args] = text.substring(1).split(" ");
        return (0, commandHandler_1.handleCommand)(ctx, command, args.join(" ")); // ctx is already available
    }
    return (0, messageHandler_1.handleMessage)(ctx);
}));
// Callback Query Handler
bot.on("callback_query", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.scene.current) {
        console.log("Scene is active, letting the scene handle the callback.");
        return;
    }
    return (0, callbackHandler_1.handleCallbackQuery)(ctx);
}));
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
exports.default = bot;

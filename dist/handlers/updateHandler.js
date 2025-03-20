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
exports.handleUpdate = handleUpdate;
const telegraf_1 = require("telegraf");
const commandHandler_1 = require("./commandHandler");
const messageHandler_1 = require("./messageHandler");
const callbackHandler_1 = require("./callbackHandler");
function handleUpdate(bot, update) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield bot.handleUpdate(update); // Let Telegraf process the update
            const ctx = new telegraf_1.Context(update, bot.telegram, bot.botInfo);
            if (update.message) {
                const text = update.message.text || "";
                if (text.startsWith("/")) {
                    const [command, ...args] = text.substring(1).split(" ");
                    return (0, commandHandler_1.handleCommand)(ctx, command, args.join(" "));
                }
                return (0, messageHandler_1.handleMessage)(ctx);
            }
            if (update.callback_query) {
                return (0, callbackHandler_1.handleCallbackQuery)(ctx);
            }
        }
        catch (error) {
            console.error("❌ Error in handleUpdate:", error);
        }
    });
}

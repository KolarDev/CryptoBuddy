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
exports.handleCallbackQuery = handleCallbackQuery;
function handleCallbackQuery(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
            const callbackData = ctx.callbackQuery.data;
            console.log("Callback data:", callbackData);
            yield ctx.answerCbQuery(); // ✅ Always acknowledge the callback query
            switch (callbackData) {
                case "price_btc":
                    return null;
                case "price_eth":
                    return null;
                default:
                    return ctx.reply("⚠️ Unknown action.");
            }
        }
        else {
            return (_a = ctx.reply) === null || _a === void 0 ? void 0 : _a.call(ctx, "⚠️ Unable to process request. Data is undefined");
        }
    });
}

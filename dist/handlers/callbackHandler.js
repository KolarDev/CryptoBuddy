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
        var _a, _b, _c, _d, _e, _f, _g;
        yield ctx.answerCbQuery(); // ✅ Always acknowledge the callback query
        // Check if callbackdata and neccessary data exists
        if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
            const callbackData = ctx.callbackQuery.data;
            console.log("Callback data:", callbackData);
            if (!ctx.chat || !ctx.from) {
                console.error("Missing chat or user information.");
                return (_a = ctx.reply) === null || _a === void 0 ? void 0 : _a.call(ctx, "⚠️ Unable to process request.");
            }
            switch (callbackData) {
                case "go_convert":
                    return ctx.scene.enter("convertScene"); // Start conversion process
                case "go_news":
                    return (_b = ctx.reply) === null || _b === void 0 ? void 0 : _b.call(ctx, "⚠️ Feature coming soon.");
                case "go_alerts":
                    return (_c = ctx.reply) === null || _c === void 0 ? void 0 : _c.call(ctx, "⚠️ Feature coming soon.");
                case "go_signals":
                    return (_d = ctx.reply) === null || _d === void 0 ? void 0 : _d.call(ctx, "⚠️ Feature coming soon.");
                case "go_settings":
                    return (_e = ctx.reply) === null || _e === void 0 ? void 0 : _e.call(ctx, "⚠️ Feature coming soon.");
                case "go_help":
                    return (_f = ctx.reply) === null || _f === void 0 ? void 0 : _f.call(ctx, "⚠️ Feature coming soon.");
                default:
                    return ctx.reply("⚠️ Unknown action.");
            }
        }
        else {
            return (_g = ctx.reply) === null || _g === void 0 ? void 0 : _g.call(ctx, "⚠️ Unable to process request. Data is undefined");
        }
    });
}

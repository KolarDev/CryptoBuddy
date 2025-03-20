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
exports.handleCommand = handleCommand;
const userService_1 = require("../services/userService");
function handleCommand(ctx, command, args) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        if (!ctx.chat || !ctx.from) {
            console.error("Missing chat or user information.");
            return (_a = ctx.reply) === null || _a === void 0 ? void 0 : _a.call(ctx, "⚠️ Unable to process request.");
        }
        const chatId = (_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id;
        const userInfo = ctx.from;
        switch (command) {
            case "start":
                console.log("start command working 🖐🖐");
                yield (0, userService_1.registerUser)(chatId, (_c = userInfo.username) !== null && _c !== void 0 ? _c : "", userInfo.first_name, (_d = userInfo.last_name) !== null && _d !== void 0 ? _d : "");
                return ctx.reply("👋 Welcome to CryptoBuddy! Use /price <coin> to get prices.");
            case "convert":
                return ctx.scene.enter("convertScene"); // Start conversion process
            default:
                return ctx.reply("⚠️ Unknown command. Try /price <coin>.");
        }
    });
}

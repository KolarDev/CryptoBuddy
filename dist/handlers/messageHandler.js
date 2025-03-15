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
exports.handleMessage = handleMessage;
const errorHandler_1 = require("../middlewares/errorHandler");
const commandHandler_1 = require("./commandHandler");
function handleMessage(messageObj) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const messageText = messageObj.text || "";
            if (!messageText)
                return;
            const chatId = messageObj.chat.id;
            if (messageText.startsWith("/")) {
                const [command, ...args] = messageText.substring(1).split(" ");
                return (0, commandHandler_1.handleCommand)(chatId, command, args.join(" "));
            }
            // If not a command
            return;
        }
        catch (error) {
            (0, errorHandler_1.errorHandler)(error, "handleMessage");
        }
    });
}

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
const axios_1 = require("../config/axios");
const priceService_1 = require("../services/priceService");
const userService_1 = require("../services/userService");
function handleCommand(chatId, command, args, userInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (command) {
            case "start":
                console.log("start command working🖐🖐");
                yield (0, userService_1.registerUser)(chatId, userInfo.username, userInfo.first_name, userInfo.last_name);
                return (0, axios_1.sendMessage)(chatId, "👋 Welcome to CryptoBuddy! Use /price <coin> to get prices.");
            case "price":
                return (0, priceService_1.handlePriceCommand)(chatId, args);
            default:
                return (0, axios_1.sendMessage)(chatId, "⚠️ Unknown command. Try /price <coin>.");
        }
    });
}

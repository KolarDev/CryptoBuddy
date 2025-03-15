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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePriceCommand = handlePriceCommand;
const axios_1 = __importDefault(require("axios"));
const axios_2 = require("../config/axios");
const errorHandler_1 = require("../middlewares/errorHandler");
function handlePriceCommand(chatId, coin) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!coin) {
            return (0, axios_2.sendMessage)(chatId, "⚡ Please provide a coin symbol, e.g., `/price btc`");
        }
        try {
            const { data } = yield axios_1.default.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
            if (!data[coin]) {
                return (0, axios_2.sendMessage)(chatId, "❌ Invalid coin symbol. Try /price btc");
            }
            const price = data[coin].usd;
            (0, axios_2.sendMessage)(chatId, `💰 ${coin.toUpperCase()} Price: *$${price}*`);
        }
        catch (error) {
            (0, errorHandler_1.errorHandler)(error, "handlePriceCommand");
        }
    });
}

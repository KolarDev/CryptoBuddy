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
exports.getCryptoPrice = getCryptoPrice;
const axios_1 = __importDefault(require("axios"));
/**
 * Fetches the exchange rate between two cryptocurrencies.
 * @param from The base cryptocurrency (e.g., BTC).
 * @param to The target cryptocurrency (e.g., USDT).
 * @returns The exchange rate or null if an error occurs.
 */
function getCryptoPrice(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get(`https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`);
            if (!data[from] || !data[from][to]) {
                return null; // Let convertScene handle the invalid response
            }
            return data[from][to]; // Return only the price
        }
        catch (error) {
            console.error("Error fetching crypto price:", error);
            return null; // Return null on failure
        }
    });
}

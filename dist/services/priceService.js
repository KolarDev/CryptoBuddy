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
exports.getCoinList = getCoinList;
const axios_1 = __importDefault(require("axios"));
/**
 * Fetches the exchange rate between two cryptocurrencies.
 * @param fromSymbol The base cryptocurrency (e.g., BTC).
 * @param toSymbol The target cryptocurrency (e.g., USDT).
 * @returns The exchange rate or null if an error occurs.
 */
function getCryptoPrice(fromSymbol, toSymbol) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`🔁 Converting ${fromSymbol} to ${toSymbol}`);
        const coinList = yield getCoinList();
        const fromId = coinList[fromSymbol.toLowerCase()];
        const toId = coinList[toSymbol.toLowerCase()];
        if (!fromId || !toId) {
            return {
                price: null,
                error: `❌ Invalid coin symbol(s):, ${fromSymbol}, ${toSymbol}`,
            };
        }
        try {
            const { data } = yield axios_1.default.get(`https://api.coingecko.com/api/v3/simple/price?ids=${fromId}&vs_currencies=${toId}`);
            if (!data[fromId] || !data[fromId][toId]) {
                return {
                    price: null,
                    error: `❌ Coin price unavailable:, ${fromSymbol}, ${toSymbol}`,
                };
            }
            return { price: data[fromId][toId] };
        }
        catch (error) {
            console.error("❌ Error fetching crypto price:", error);
            return { price: null, error: `❌ Error fetching crypto price:", ${error}` };
        }
    });
}
let coinListCache = {};
function getCoinList() {
    return __awaiter(this, void 0, void 0, function* () {
        if (Object.keys(coinListCache).length > 0)
            return coinListCache;
        try {
            const { data } = yield axios_1.default.get("https://api.coingecko.com/api/v3/coins/list");
            coinListCache = data.reduce((map, coin) => {
                map[coin.symbol.toLowerCase()] = coin.id;
                return map;
            }, {});
            return coinListCache;
        }
        catch (err) {
            console.error("❌ Error fetching CoinGecko coin list:", err);
            return {};
        }
    });
}

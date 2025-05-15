import axios from "axios";
import { config } from "./../config/envSchema";

/**
 * Fetches the exchange rate between two cryptocurrencies.
 * @param fromSymbol The base cryptocurrency (e.g., BTC).
 * @param toSymbol The target cryptocurrency (e.g., USDT).
 * @returns The exchange rate or null if an error occurs.
 */



const CMC_BASE_URL = "https://pro-api.coinmarketcap.com/v1";
const API_KEY = config.CMC_API_KEY!;


export async function getCryptoPrice(
  rawFrom: string,
  rawTo: string,
  amount: number = 1
): Promise<{ price: number | null; error?: string }> {
  await loadSupportedCoins();

  const fromSymbol = coinMapCache[rawFrom.toLowerCase()];
  const toSymbol = coinMapCache[rawTo.toLowerCase()];

  if (!fromSymbol || !toSymbol) {
    return {
      price: null,
      error: `❌ Unsupported coin(s): ${!fromSymbol ? rawFrom : ""} ${
        !toSymbol ? rawTo : ""
      }`,
    };
  }

  try {
    const response = await axios.get(`${CMC_BASE_URL}/tools/price-conversion`, {
      params: {
        amount,
        symbol: fromSymbol,
        convert: toSymbol,
      },
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
      },
    });

    const price = response.data.data?.quote?.[toSymbol]?.price;

    if (!price) {
      return {
        price: null,
        error: `❌ Conversion data not available for ${fromSymbol} to ${toSymbol}`,
      };
    }

    return { price };
  } catch (error: any) {
    console.error("❌ CoinMarketCap Error:", error?.response?.data || error.message);
    return { price: null, error: "❌ Failed to fetch price from CoinMarketCap." };
  }
}



let coinMapCache: Record<string, string> = {}; // name/symbol (lowercase) => actual symbol

/**
 * Fetch and cache supported coin symbols from CMC
 */
export async function loadSupportedCoins(): Promise<void> {
  if (Object.keys(coinMapCache).length > 0) return;

  try {
    const { data } = await axios.get(`${CMC_BASE_URL}/cryptocurrency/map`, {
      headers: { "X-CMC_PRO_API_KEY": API_KEY },
    });

    for (const coin of data.data) {
      coinMapCache[coin.symbol.toLowerCase()] = coin.symbol;
      coinMapCache[coin.name.toLowerCase()] = coin.symbol;
    }
  } catch (err) {
    console.error("❌ Failed to load supported coins:", err);
  }
}


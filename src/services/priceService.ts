import axios from "axios";

/**
 * Fetches the exchange rate between two cryptocurrencies.
 * @param fromSymbol The base cryptocurrency (e.g., BTC).
 * @param toSymbol The target cryptocurrency (e.g., USDT).
 * @returns The exchange rate or null if an error occurs.
 */

export async function getCryptoPrice(
  fromSymbol: string,
  toSymbol: string
): Promise<{ price: number | null; error?: string }> {
  console.log(`🔁 Converting ${fromSymbol} to ${toSymbol}`);

  const coinList = await getCoinList();
  const fromId = coinList[fromSymbol.toLowerCase()];
  const toId = coinList[toSymbol.toLowerCase()];

  if (!fromId || !toId) {
    return {
      price: null,
      error: `❌ Invalid coin symbol(s):, ${fromSymbol}, ${toSymbol}`,
    };
  }

  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromId}&vs_currencies=${toId}`
    );

    if (!data[fromId] || !data[fromId][toId]) {
      return {
        price: null,
        error: `❌ Coin price unavailable:, ${fromSymbol}, ${toSymbol}`,
      };
    }

    return { price: data[fromId][toId] };
  } catch (error) {
    console.error("❌ Error fetching crypto price:", error);
    return { price: null, error: `❌ Error fetching crypto price:", ${error}` };
  }
}

let coinListCache: { [symbol: string]: string } = {};

export async function getCoinList(): Promise<{ [symbol: string]: string }> {
  if (Object.keys(coinListCache).length > 0) return coinListCache;

  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/list"
    );
    coinListCache = data.reduce((map: any, coin: any) => {
      map[coin.symbol.toLowerCase()] = coin.id;
      return map;
    }, {});
    return coinListCache;
  } catch (err) {
    console.error("❌ Error fetching CoinGecko coin list:", err);
    return {};
  }
}

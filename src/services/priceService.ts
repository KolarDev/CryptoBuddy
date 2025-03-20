import axios from "axios";

/**
 * Fetches the exchange rate between two cryptocurrencies.
 * @param from The base cryptocurrency (e.g., BTC).
 * @param to The target cryptocurrency (e.g., USDT).
 * @returns The exchange rate or null if an error occurs.
 */
export async function getCryptoPrice(
  from: string,
  to: string
): Promise<number | null> {
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`
    );

    if (!data[from] || !data[from][to]) {
      return null; // Let convertScene handle the invalid response
    }

    return data[from][to]; // Return only the price
  } catch (error) {
    console.error("Error fetching crypto price:", error);
    return null; // Return null on failure
  }
}

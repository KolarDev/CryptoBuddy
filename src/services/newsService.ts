// services/newsFetcher.ts
import axios from "axios";
import { config } from "./../config/envSchema";

export async function fetchCryptoNews(): Promise<string[]> {
  try {
    const { data } = await axios.get("https://newsdata.io/api/1/news", {
      params: {
        apikey: config.NEWSDATA_API_KEY,
        q: "crypto",
        language: "en",
        category: "business",
      },
    });

    const results = data.results || [];
    console.log(results);
    return results
      .slice(0, 5)
      .map((item: any) => `📰 ${item.title}\n🔗 ${item.link}`);
  } catch (error) {
    console.error("❌ Failed to fetch news:", error);
    return ["❌ Unable to fetch news at this time."];
  }
}

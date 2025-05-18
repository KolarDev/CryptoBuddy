// services/newsFetcher.ts
import axios from "axios";
import { config } from "./../config/envSchema";

export async function fetchCryptoNews(): Promise<{
  results: string[] | null;
  error?: string;
}> {
  try {
    // query with the params
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
    const newsResults = results
      .slice(0, 5)
      .map((item: any) => `📰 ${item.title}\n🔗 ${item.link}`);
    return { results: newsResults };
  } catch (error) {
    console.error("❌ Failed to fetch news:", error);
    return { results: null, error: "❌ Unable to fetch news at this time." };
  }
}

import { axiosInstance } from "./axios";
import { config } from "./envSchema";


export async function setWebhook() {
  try {
    const webhookUrl = `${config.WEBHOOK_URL}/webhook`;
    await axiosInstance.get("setWebhook", {
      params: { url: webhookUrl },
    });
    console.log("✅ Webhook set successfully!");
  } catch (error) {
    console.error("❌ Failed to set webhook:", error);
  }
}

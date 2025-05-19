import { Scenes, Composer, Markup } from "telegraf";
import { MyContext, NewsSceneSession } from "../interfaces/scenesInterface";
import { fetchCryptoNews } from "../services/newsService";
import {
  addSubscription,
  removeSubscription,
  isSubscribed,
  getUserSubscriptions,
} from "../services/subscriptionService";

// Create a composer to manage handlers
const step1 = new Composer<MyContext<NewsSceneSession>>();
const step2 = new Composer<MyContext<NewsSceneSession>>();
// const step3 = new Composer<MyContext<NewsSceneSession>>();
// const step4 = new Composer<MyContext<NewsSceneSession>>();

// Step 1 – handle selected type and ask to subscribe or unsubscribe
step1.on("callback_query", async (ctx) => {
  const cbq = ctx.callbackQuery;
  if ("data" in cbq) {
    const data = cbq.data;
    const type = data === "news_crypto" ? "crypto_news" : "trading_signals";

    ctx.scene.session.selectedType = type;

    await ctx.editMessageText(
      `You selected *${type.replace("_", " ")}*. What would you like to do?`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("✅ Read News", "read_news")],
          [Markup.button.callback("✅ Subscribe", "subscribe")],
          [Markup.button.callback("🚫 Unsubscribe", "unsubscribe")],
        ]),
      }
    );

    return ctx.wizard.next(); // Move to step 2
  }
});

// Step 2 – subscribe/unsubscribe logic
step2.on("callback_query", async (ctx) => {
  const cbq = ctx.callbackQuery;
  if ("data" in cbq) {
    const action = cbq.data;
    const type = ctx.scene.session.selectedType;
    const chatId = ctx.chat?.id;

    if (!chatId || !type) {
      return ctx.reply("❌ Something went wrong.");
    }

    if (action === "subscribe") {
      await addSubscription(chatId, type);
      await ctx.editMessageText(
        `✅ Subscribed to *${type.replace("_", " ")}*!`,
        { parse_mode: "Markdown" }
      );
    } else if (action === "unsubscribe") {
      await removeSubscription(chatId, type);
      await ctx.editMessageText(
        `🚫 Unsubscribed from *${type.replace("_", " ")}*.`,
        { parse_mode: "Markdown" }
      );
    } else if (action === "read_news") {
      const news = await fetchCryptoNews();
      await ctx.reply(news.toString());

      return ctx.scene.reenter(); // Restart the scene
    }
  }
});

// Create the scene using the composers
export const newsScene = new Scenes.WizardScene<MyContext<NewsSceneSession>>(
  "newsScene",
  async (ctx) => {
    ctx.reply(
      "📰 What type of news are you interested in?",
      Markup.inlineKeyboard([
        [Markup.button.callback("🪙 Crypto News", "news_crypto")],
        [Markup.button.callback("📈 Trading Signals", "news_trading")],
      ])
    );
    return ctx.wizard.next();
  },
  step1, // Handles
  step2 // Handles
);

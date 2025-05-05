// import { Scenes } from "telegraf";
// import { MyContext } from "../interfaces/scenesInterface";
// import {
//   addSubscription,
//   removeSubscription,
//   isSubscribed,
//   getUserSubscriptions,
// } from "../services/subscriptionService";

// export const newsScene = new Scenes.BaseScene<MyContext>("newsScene");

// newsScene.enter(async (ctx) => {
//   ctx.reply(
//     "📢 Manage your subscriptions:\n\n" +
//       "✅ /subscribe news - Crypto News\n" +
//       "✅ /subscribe alerts - Price Alerts\n" +
//       "✅ /subscribe signals - Trading Signals\n\n" +
//       "❌ /unsubscribe news - Unsubscribe News\n" +
//       "❌ /unsubscribe alerts - Unsubscribe Alerts\n" +
//       "❌ /unsubscribe signals - Unsubscribe Signals\n\n" +
//       "📋 /my_subscriptions - View My Subscriptions"
//   );
// });

// // Subscribe command
// newsScene.command("subscribe", async (ctx) => {
//   const chatId = ctx.chat!.id;
//   const args = ctx.message.text.split(" ")[1]; // Get second word as subscription type

//   const typeMap: Record<string, string> = {
//     news: "crypto_news",
//     alerts: "price_alerts",
//     signals: "trading_signals",
//   };

//   const type = typeMap[args];
//   if (!type) return ctx.reply("⚠️ Invalid subscription type!");

//   if (await isSubscribed(chatId, type)) {
//     return ctx.reply(
//       `✅ You are already subscribed to ${type.replace("_", " ")}`
//     );
//   }

//   await addSubscription(chatId, type);
//   ctx.reply(`🎉 You have subscribed to ${type.replace("_", " ")} updates!`);
// });

// // Unsubscribe command
// newsScene.command("unsubscribe", async (ctx) => {
//   const chatId = ctx.chat!.id;
//   const args = ctx.message.text.split(" ")[1];

//   const typeMap: Record<string, string> = {
//     news: "crypto_news",
//     alerts: "price_alerts",
//     signals: "trading_signals",
//   };

//   const type = typeMap[args];
//   if (!type) return ctx.reply("⚠️ Invalid subscription type!");

//   if (!(await isSubscribed(chatId, type))) {
//     return ctx.reply(`❌ You are not subscribed to ${type.replace("_", " ")}`);
//   }

//   await removeSubscription(chatId, type);
//   ctx.reply(`🛑 You have unsubscribed from ${type.replace("_", " ")} updates.`);
// });

// // View user subscriptions
// newsScene.command("my_subscriptions", async (ctx) => {
//   const chatId = ctx.chat!.id;
//   const subscriptions = await getUserSubscriptions(chatId);

//   if (subscriptions.length === 0) {
//     return ctx.reply("📋 You are not subscribed to any updates.");
//   }

//   ctx.reply(
//     `📋 Your active subscriptions:\n` +
//       subscriptions.map((sub) => `✅ ${sub.replace("_", " ")}`).join("\n")
//   );
// });

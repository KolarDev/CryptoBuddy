import { Markup, Scenes, Composer } from "telegraf";
import { getCryptoPrice } from "../services/priceService";
import { ConvertSceneSession, MyContext } from "../interfaces/scenesInterface";

// Create a composer to manage handlers
const step1 = new Composer<MyContext<ConvertSceneSession>>();
const step2 = new Composer<MyContext<ConvertSceneSession>>();
const step3 = new Composer<MyContext<ConvertSceneSession>>();
const step4 = new Composer<MyContext<ConvertSceneSession>>();

// Step 1: Ask user for the cryptocurrency they have
step1.on("text", async (ctx) => {
  ctx.scene.session.fromCoin = ctx.message.text.toUpperCase();
  await ctx.reply(
    `✅ Got it! Now enter the amount of ${ctx.scene.session.fromCoin}:`
  );
  return ctx.wizard.next();
});

// Step 2: Ask for amount
step2.on("text", async (ctx) => {
  const amount = Number(ctx.message.text);
  if (isNaN(amount)) {
    return ctx.reply("⚠️ Please enter a valid amount.");
  }

  ctx.scene.session.amount = amount;

  // Show inline keyboard for conversion options
  await ctx.reply(
    "🔄 Choose how you want to convert:",
    Markup.inlineKeyboard([
      [Markup.button.callback("💵 Convert to USD", "convert_usd")],
      [Markup.button.callback("🔄 Convert to Other Coins", "convert_crypto")],
    ])
  );
});

// Step 3: Handle conversion to USD
step3.action("convert_usd", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.scene.session.toCoin = "USD";

  const price = await getCryptoPrice(ctx.scene.session.fromCoin!, "USD");
  if (!price) {
    await ctx.reply("❌ Conversion failed. Check coin symbols and try again.");
    return ctx.scene.leave();
  }

  const convertedAmount = (ctx.scene.session.amount! * price).toFixed(2);
  await ctx.reply(
    `✅ ${ctx.scene.session.amount} ${ctx.scene.session.fromCoin} is **${convertedAmount} USD** 💱`
  );

  return ctx.scene.leave();
});

// Step 4: Ask user for target currency if not converting to USD
step3.action("convert_crypto", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    "💱 Enter the coin you want to convert to (e.g., USDT, BNB):"
  );
  return ctx.wizard.next();
});

// Step 5: Handle target currency input and perform conversion
step4.on("text", async (ctx) => {
  ctx.scene.session.toCoin = ctx.message.text.toUpperCase();

  const price = await getCryptoPrice(
    ctx.scene.session.fromCoin!,
    ctx.scene.session.toCoin
  );
  if (!price) {
    await ctx.reply("❌ Conversion failed. Check coin symbols and try again.");
    return ctx.scene.leave();
  }

  const convertedAmount = (ctx.scene.session.amount! * price).toFixed(2);
  await ctx.reply(
    `✅ ${ctx.scene.session.amount} ${ctx.scene.session.fromCoin} is **${convertedAmount} ${ctx.scene.session.toCoin}** 💱`
  );

  return ctx.scene.leave();
});

// Create the scene using the composers
export const convertScene = new Scenes.WizardScene<
  MyContext<ConvertSceneSession>
>(
  "convertScene",
  async (ctx) => {
    await ctx.reply("💰 Enter the coin you have (e.g., BTC, ETH):");
    return ctx.wizard.next();
  },
  step1, // Handles input for "fromCoin"
  step2, // Handles input for "amount"
  step3, // Handles conversion selection (USD or Other Coins)
  step4 // Handles input for "toCoin" if not USD
);

// import { Markup, Scenes } from "telegraf";
// import { getCryptoPrice } from "../services/priceService";
// import { ConvertSceneSession, MyContext } from "../interfaces/scenesInterface";

// export const convertScene = new Scenes.WizardScene<
//   MyContext<ConvertSceneSession>
// >(
//   "convertScene",
//   async (ctx) => {
//     await ctx.reply("💰 Enter the coin you have (e.g., BTC, ETH):");
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     if (!ctx.message || !("text" in ctx.message)) {
//       return ctx.reply("⚠️ Please enter a valid cryptocurrency symbol.");
//     }
//     ctx.scene.session.fromCoin = ctx.message.text.toUpperCase();

//     // Ask for amount
//     await ctx.reply(
//       `✅ Got it! Now enter the amount of ${ctx.session.data.fromCoin}:`
//     );
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     if (
//       !ctx.message ||
//       !("text" in ctx.message) ||
//       isNaN(Number(ctx.message.text))
//     ) {
//       return ctx.reply("⚠️ Please enter a valid amount.");
//     }
//     ctx.session.data.amount = Number(ctx.message.text);

//     // Show inline keyboard to choose conversion type
//     await ctx.reply(
//       "🔄 Choose how you want to convert:",
//       Markup.inlineKeyboard([
//         [Markup.button.callback("💵 Convert to USD", "convert_usd")],
//         [Markup.button.callback("🔄 Convert to Other Coins", "convert_crypto")],
//       ])
//     );
//   }
// );

// // ✅ Auto-assign "USD" as target currency and proceed to conversion
// convertScene.action("convert_usd", async (ctx) => {
//   await ctx.answerCbQuery();
//   ctx.session.data.toCoin = "USD";

//   if (!ctx.session.data.fromCoin) {
//     return ctx.reply("⚠️ Please enter a valid cryptocurrency symbol.");
//   }

//   // Fetch conversion rate
//   const price = await getCryptoPrice(ctx.session.data.fromCoin, "USD");

//   if (!price) {
//     ctx.reply("❌ Conversion failed. Check coin symbols and try again.");
//     return ctx.scene.leave();
//   }

//   const convertedAmount = (ctx.session.data.amount! * price).toFixed(2);
//   ctx.reply(
//     `✅ ${ctx.session.data.amount} ${ctx.session.data.fromCoin} is **${convertedAmount} USD** 💱`
//   );

//   return ctx.scene.leave();
// });

// // 🔄 Ask user for target currency
// convertScene.action("convert_crypto", async (ctx) => {
//   await ctx.answerCbQuery();
//   await ctx.reply(
//     "💱 Enter the coin you want to convert to (e.g., USDT, BNB):"
//   );
//   return ctx.wizard.next();
// });

// // 💱 Handle user input for target currency and complete conversion
// convertScene.on("text", async (ctx) => {
//   if (!ctx.session.data.toCoin) {
//     ctx.session.data.toCoin = ctx.message.text.toUpperCase();
//   }

//   if (!ctx.session.data.fromCoin) {
//     return ctx.reply("⚠️ Please enter a valid cryptocurrency symbol.");
//   }

//   // Fetch conversion rate
//   const price = await getCryptoPrice(
//     ctx.session.data.fromCoin,
//     ctx.session.data.toCoin
//   );

//   if (!price) {
//     ctx.reply("❌ Conversion failed. Check coin symbols and try again.");
//     return ctx.scene.leave();
//   }

//   const convertedAmount = (ctx.session.data.amount! * price).toFixed(2);
//   ctx.reply(
//     `✅ ${ctx.session.data.amount} ${ctx.session.data.fromCoin} is **${convertedAmount} ${ctx.session.data.toCoin}** 💱`
//   );

//   return ctx.scene.leave();
// });

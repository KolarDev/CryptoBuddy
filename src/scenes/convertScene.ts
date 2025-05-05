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
  console.log("📌 ctx.scene.session:", ctx.scene.session);

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
  return ctx.wizard.next();
});

step3.on("callback_query", async (ctx) => {
  await ctx.answerCbQuery(); // Acknowledge button click

  const cbq = ctx.callbackQuery;

  if ("data" in cbq) {
    const callbackData = cbq.data;
    console.log("Callback Data:", callbackData);
    const fromCoin = ctx.scene.session.fromCoin;
    const amount = ctx.scene.session.amount;

    // Perform next action based on callback data
    if (callbackData === "convert_usd") {
      ctx.scene.session.toCoin = "USD";
      const fromCoin = ctx.scene.session.fromCoin;
      const amount = ctx.scene.session.amount;
      const toCoin = ctx.scene.session.toCoin;

      // Ensure fromCoin and amount exist before using them
      if (!fromCoin || !amount) {
        await ctx.reply(
          "❌ Conversion failed. Session data is missing. Please restart."
        );
        return ctx.scene.leave();
      }

      console.log(`fromCoin ${fromCoin} toCoin ${toCoin} amount ${amount}`);

      const { price, error } = await getCryptoPrice(fromCoin, "USD");
      if (error) {
        await ctx.reply(error);
        return ctx.scene.leave();
      }
      if (price === null) {
        await ctx.reply(
          "Unable to get the price. Check the coin symbols and try again."
        );
        return ctx.scene.leave();
      }

      const result = (amount * price).toFixed(2);
      await ctx.reply(`✅ ${amount} ${fromCoin} is **${result} USD** 💱`);

      return ctx.scene.leave();
    } else if (callbackData === "convert_crypto") {
      await ctx.reply(
        "💱 Enter the coin you want to convert to (e.g., USDT, BNB):"
      );
      return ctx.wizard.next();
    }
    // Respond error message if there is no callbackdata
  } else {
    return ctx.reply("⚠️ Error! No callback data.");
  }
});

// Step 4: Handle conversion to another crypto
step4.on("text", async (ctx) => {
  ctx.scene.session.toCoin = ctx.message.text.toUpperCase();
  const fromCoin = ctx.scene.session.fromCoin;
  const amount = ctx.scene.session.amount;
  const toCoin = ctx.scene.session.toCoin;

  if (!fromCoin || !amount) {
    await ctx.reply("❌ Conversion failed. Missing session data.");
    return ctx.scene.leave();
  }

  const { price, error } = await getCryptoPrice(fromCoin, toCoin);
  if (error) {
    await ctx.reply(error);
    return ctx.scene.leave();
  }
  if (price === null) {
    await ctx.reply(
      "Unable to get the price. Check the coin symbols and try again."
    );
    return ctx.scene.leave();
  }

  const result = (amount * price).toFixed(2);
  await ctx.reply(`✅ ${amount} ${fromCoin} = **${result} ${toCoin}** 💱`);
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

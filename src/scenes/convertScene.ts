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

  const callbackData = ctx.callbackQuery.data;
  console.log("Callback Data:", callbackData);

  if (callbackData === "convert_usd") {
    ctx.scene.session.toCoin = "USD";

    // Ensure fromCoin and amount exist before using them
    if (!ctx.scene.session.fromCoin || !ctx.scene.session.amount) {
      await ctx.reply(
        "❌ Conversion failed. Session data is missing. Please restart."
      );
      return ctx.scene.leave();
    }

    console.log(
      `fromCoin ${ctx.scene.session.fromCoin} toCoin ${ctx.scene.session.toCoin} amount ${ctx.scene.session.amount}`
    );

    const price = await getCryptoPrice(ctx.scene.session.fromCoin, "USD");
    if (!price) {
      await ctx.reply(
        "❌ Conversion failed. Check coin symbols and try again."
      );
      return ctx.scene.leave();
    }

    const convertedAmount = (ctx.scene.session.amount * price).toFixed(2);
    await ctx.reply(
      `✅ ${ctx.scene.session.amount} ${ctx.scene.session.fromCoin} is **${convertedAmount} USD** 💱`
    );

    return ctx.scene.leave();
  } else if (callbackData === "convert_crypto") {
    await ctx.reply(
      "💱 Enter the coin you want to convert to (e.g., USDT, BNB):"
    );
    return ctx.wizard.next();
  }
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

import { Markup, Scenes, Composer } from "telegraf";
import { getCryptoPrice } from "../services/priceService";
import { ConvertSceneSession, MyContext } from "../interfaces/scenesInterface";

// Step composers
const step1 = new Composer<MyContext<ConvertSceneSession>>();
const step2 = new Composer<MyContext<ConvertSceneSession>>();
const step3 = new Composer<MyContext<ConvertSceneSession>>();
const step4 = new Composer<MyContext<ConvertSceneSession>>();

// Step 1: Ask user for the cryptocurrency they have
step1.on("text", async (ctx) => {
  ctx.scene.session.fromCoin = ctx.message.text.toUpperCase();
  await ctx.reply(`✅ Got it! Now enter the amount of ${ctx.scene.session.fromCoin}:`);
  return ctx.wizard.next();
});

// Step 2: Ask for amount and show conversion options
step2.on("text", async (ctx) => {
  const amount = Number(ctx.message.text);
  if (isNaN(amount)) {
    return ctx.reply("⚠️ Please enter a valid amount.");
  }

  ctx.scene.session.amount = amount;

  await ctx.reply(
    "🔄 Choose how you want to convert:",
    Markup.inlineKeyboard([
      [Markup.button.callback("💵 Convert to USD", "convert_usd")],
      [Markup.button.callback("🔄 Convert to Other Coins", "convert_crypto")],
    ])
  );
  return ctx.wizard.next();
});

// Step 3: Handle conversion type choice
step3.on("callback_query", async (ctx) => {
  const choice = ctx.callbackQuery.data;
  await ctx.answerCbQuery();

  if (!ctx.scene.session.fromCoin || !ctx.scene.session.amount) {
    await ctx.reply("❌ Conversion failed. Missing session data.");
    return ctx.scene.leave();
  }

  if (choice === "convert_usd") {
    const price = await getCryptoPrice(ctx.scene.session.fromCoin, "USD");
    if (!price) {
      await ctx.reply("❌ Conversion failed. Invalid coin symbol.");
      return ctx.scene.leave();
    }

    const result = (ctx.scene.session.amount * price).toFixed(2);
    await ctx.reply(`✅ ${ctx.scene.session.amount} ${ctx.scene.session.fromCoin} = **${result} USD** 💱`);
    return ctx.scene.leave();
  }

  if (choice === "convert_crypto") {
    await ctx.reply("💱 Enter the coin you want to convert to (e.g., USDT, BNB):");
    return ctx.wizard.next();
  }

  await ctx.reply("❌ Unknown action.");
});

// Step 4: Handle conversion to another crypto
step4.on("text", async (ctx) => {
  ctx.scene.session.toCoin = ctx.message.text.toUpperCase();

  if (!ctx.scene.session.fromCoin || !ctx.scene.session.amount) {
    await ctx.reply("❌ Conversion failed. Missing session data.");
    return ctx.scene.leave();
  }

  const price = await getCryptoPrice(ctx.scene.session.fromCoin, ctx.scene.session.toCoin);
  if (!price) {
    await ctx.reply("❌ Conversion failed. Invalid coin symbol.");
    return ctx.scene.leave();
  }

  const result = (ctx.scene.session.amount * price).toFixed(2);
  await ctx.reply(
    `✅ ${ctx.scene.session.amount} ${ctx.scene.session.fromCoin} = **${result} ${ctx.scene.session.toCoin}** 💱`
  );
  return ctx.scene.leave();
});

// Create the Wizard Scene
export const convertScene = new Scenes.WizardScene<MyContext<ConvertSceneSession>>(
  "convertScene",
  async (ctx) => {
    await ctx.reply("💰 Enter the coin you have (e.g., BTC, ETH):");
    return ctx.wizard.next();
  },
  step1,
  step2,
  step3,
  step4
);

import { Scenes } from "telegraf";
import { getCryptoPrice } from "../services/priceService";

export const convertScene = new Scenes.WizardScene(
  "convertScene",
  async (ctx) => {
    ctx.reply("💰 Enter the coin you have (e.g., BTC, ETH):");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !("text" in ctx.message)) {
      return ctx.reply("⚠️ Please enter a valid cryptocurrency symbol.");
    }
    ctx.session.fromCoin = ctx.message.text.toUpperCase();
    ctx.reply(`✅ Got it! Now enter the amount of ${ctx.session.fromCoin}:`);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || isNaN(Number(ctx.message.text))) {
      return ctx.reply("⚠️ Please enter a valid amount.");
    }
    ctx.session.amount = Number(ctx.message.text);
    ctx.reply("🔄 Enter the coin you want to convert to (e.g., USDT, BNB):");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !("text" in ctx.message)) {
      return ctx.reply("⚠️ Please enter a valid cryptocurrency symbol.");
    }
    ctx.session.toCoin = ctx.message.text.toUpperCase();

    // Fetch conversion rate
    const price = await getCryptoPrice(
      ctx.session.fromCoin,
      ctx.session.toCoin
    );

    if (!price) {
      ctx.reply("❌ Conversion failed. Check coin symbols and try again.");
      return ctx.scene.leave();
    }

    const convertedAmount = (ctx.session.amount * price).toFixed(2);
    ctx.reply(
      `✅ ${ctx.session.amount} ${ctx.session.fromCoin} is **${convertedAmount} ${ctx.session.toCoin}** 💱`
    );

    return ctx.scene.leave(); // End scene
  }
);

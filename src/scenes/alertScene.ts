import { Markup, Scenes, Composer } from "telegraf";
import { AlertSceneSession, MyContext } from "../interfaces/scenesInterface";
import { savePriceAlert } from "../services/alertService"; 
import { getCryptoPrice } from "../services/priceService";

// Create composers for each step
const step1 = new Composer<MyContext<AlertSceneSession>>();
const step2 = new Composer<MyContext<AlertSceneSession>>();
const step3 = new Composer<MyContext<AlertSceneSession>>();

/**
 * Step 1: Ask for the cryptocurrency symbol.
 */
step1.on("text", async (ctx) => {
  const symbol = ctx.message.text.toUpperCase().trim();
  if (symbol.length < 2 || symbol.length > 5) {
    return ctx.reply("⚠️ Please enter a valid coin symbol (e.g., BTC, ETH).");
  }

  // 1. Fetch the current price against USDT
  const { price, error } = await getCryptoPrice(symbol, "USDT");

  if (error || price === null) {
    // Check if the error is due to an unsupported coin
    if (error && error.includes("Unsupported coin")) {
        return ctx.reply(`❌ **${symbol}** is an unsupported coin. Please enter a valid symbol.`);
    }
    // General error
    return ctx.reply(`❌ Failed to fetch the current price for **${symbol}**. Please try again later or check the symbol.`);
  }

  // Format the price for display
  const currentPrice = price.toFixed(2);
  ctx.scene.session.coinSymbol = symbol;

  let message = `✅ Tracking **${symbol}**.\n\n`;
  message += `**Current Price:** **$${currentPrice}**\n\n`;
  message += `Now, choose the alert type:`;

  ctx.scene.session.coinSymbol = symbol;

  await ctx.reply(`✅ Tracking **${symbol}**. Now, choose the alert type:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("📈 Rises to...", "alert_rise")],
      [Markup.button.callback("📉 Falls below...", "alert_fall")],
    ])
  );
  return ctx.wizard.next();
});

/**
 * Step 2: Handle alert type selection (RISE/FALL) and ask for target price.
 */
step2.on("callback_query", async (ctx) => {
  await ctx.answerCbQuery();

  const cbq = ctx.callbackQuery;

  if ("data" in cbq) {
    const callbackData = cbq.data;

    if (callbackData === "alert_rise") {
        ctx.scene.session.alertType = 'RISE';
        await ctx.reply("📈 Enter the price it needs to **rise to** (e.g., 60000):");
    } else if (callbackData === "alert_fall") {
        ctx.scene.session.alertType = 'FALL';
        await ctx.reply("📉 Enter the price it needs to **fall below** (e.g., 40000):");
    } else {
        return ctx.reply("⚠️ Invalid selection. Please choose an alert type.");
    }

    return ctx.wizard.next();
    
    } else {
        return ctx.reply("⚠️ Error! No callback data.");
    }
});

/**
 * Step 3: Handle target price input, save the alert, and leave the scene.
 */
step3.on("text", async (ctx) => {
  const price = Number(ctx.message.text.trim());

  if (isNaN(price) || price <= 0) {
    return ctx.reply("⚠️ Please enter a valid positive price amount.");
  }
  
  const chatId = ctx.from!.id;
  const { coinSymbol, alertType } = ctx.scene.session;
  
  if (!coinSymbol || !alertType) {
    await ctx.reply("❌ Error: Missing alert details. Please restart with /start.");
    return ctx.scene.leave();
  }

  ctx.scene.session.targetPrice = price;

  try {
    // 1. CALL THE SERVICE TO SAVE THE ALERT
    await savePriceAlert(
      chatId,
      coinSymbol,
      price,
      alertType
    );

    const conditionText = alertType === 'RISE' ? 'rise to' : 'fall below';
    const message = `✅ Alert Set!\n\nI will notify you when **${coinSymbol}** happens to **${conditionText} $${price}**.`;

    await ctx.reply(message);
  } catch (error) {
    await ctx.reply("❌ There was an error saving your alert. Please try again.");
  }
  // NOTE: You need a background job (cron/interval) to periodically check coin prices
  // and trigger these alerts!

  return ctx.scene.leave();
});

// Create the scene using the composers
export const alertScene = new Scenes.WizardScene<MyContext<AlertSceneSession>>(
  "alertScene",
  async (ctx) => {
    await ctx.reply("💰 Enter the **symbol** of the coin you want to track (e.g., BTC, ETH):");
    return ctx.wizard.next();
  },
  step1, // Handles coin symbol input & asks for alert type
  step2, // Handles alert type selection & asks for target price
  step3  // Handles target price input & saves the alert
);
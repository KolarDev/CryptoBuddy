import { Telegraf, Context, Scenes, session } from "telegraf";
import { config } from "./config/envSchema";
import { BaseWizardSession, MyContext } from "./interfaces/scenesInterface";
import { convertScene } from "./scenes/convertScene";
import { handleMessage } from "./handlers/messageHandler";
import { handleCommand } from "./handlers/commandHandler";
import { validateContext } from "./middlewares/validateContext";
import { WizardSessionData } from "telegraf/typings/scenes";
import { handleCallbackQuery } from "./handlers/callbackHandler";

// Create bot instance with the correct context type
const bot = new Telegraf<MyContext>(config.TELEGRAM_BOT_TOKEN!);

// Register Scene
const stage = new Scenes.Stage<MyContext<BaseWizardSession>>([convertScene]);

// Middleware
bot.use(session()); // Enable session
bot.use(stage.middleware()); // Enable scenes

bot.use(validateContext);

// Command Handler
bot.on("text", async (ctx: MyContext) => {
  console.log(ctx);
  if (!ctx.message || !("text" in ctx.message)) {
    return; // Ignore if the message is not a text message
  }

  const text = ctx.message.text || "";
  if (text.startsWith("/")) {
    const [command, ...args] = text.substring(1).split(" ");
    return handleCommand(ctx, command, args.join(" ")); // ctx is already available
  }
  return handleMessage(ctx);
});

// Callback Query Handler
bot.on("callback_query", async (ctx: MyContext) => {
  if (ctx.scene.current) {
    console.log("Scene is active, letting the scene handle the callback.");
    return;
  }
  return handleCallbackQuery(ctx);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default bot;

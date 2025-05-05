import { Scenes, Composer, Markup } from "telegraf";
import { MyContext, NewsSceneSession } from "../interfaces/scenesInterface";
import {
  addSubscription,
  removeSubscription,
  isSubscribed,
  getUserSubscriptions,
} from "../services/subscriptionService";

// Create a composer to manage handlers
const step1 = new Composer<MyContext<NewsSceneSession>>();
const step2 = new Composer<MyContext<NewsSceneSession>>();
const step3 = new Composer<MyContext<NewsSceneSession>>();
const step4 = new Composer<MyContext<NewsSceneSession>>();

// Step 1: move based on the callback data
step1.on("callback_query", async (ctx) => {
  await ctx.answerCbQuery(); // Acknowledge button click

  const cbq = ctx.callbackQuery;

  if ("data" in cbq) {
    const callbackData = cbq.data;
    console.log("Callback Data:", callbackData);

    ctx.scene.session.type = "";
    await ctx.reply();
    return ctx.wizard.next();
  }
});

// Create the scene using the composers
export const convertScene = new Scenes.WizardScene<MyContext<NewsSceneSession>>(
  "newsScene",
  async (ctx) => {
    await ctx.reply(""); // reply with the inline buttons
    return ctx.wizard.next();
  },
  step1, // Handles
  step2, // Handles
  step3, // Handles
  step4 // Handles
);

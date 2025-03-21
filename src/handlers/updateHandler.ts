import { Telegraf } from "telegraf";
import { MyContext } from "../interfaces/scenesInterface";

export async function handleUpdate(bot: Telegraf<MyContext>, update: any) {
  try {
    await bot.handleUpdate(update); // Telegraf processes and routes it automatically
  } catch (error) {
    console.error("❌ Error in handleUpdate:", error);
  }
}

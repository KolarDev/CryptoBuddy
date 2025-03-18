import { Context } from "telegraf";

export function validateContext(ctx: Context, next: () => Promise<void>) {
  if (!ctx.chat || !ctx.from) {
    console.error("🚨 Missing chat or user information.");
    return ctx.reply?.("⚠️ Unable to process request.");
  }

  return next(); // Proceed to the next middleware or handler
}

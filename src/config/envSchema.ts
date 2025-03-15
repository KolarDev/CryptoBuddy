import "dotenv/config";
import * as z from "zod";

const configSchema = z
  .object({
    PORT: z.coerce.number().default(9091).readonly(),
    NODE_ENV: z
      .enum(["DEVELOPMENT", "PRODUCTION", "STAGING"])
      .default("DEVELOPMENT")
      .readonly(),
    ALLOWED_ORIGINS: z.string().default("*"),
    DATABASE_LOCAL: z.string().min(1, "DATABASE_LOCAL is required!"),
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    WEBHOOK_URL: z.string().optional(),
    MAIL_HOST: z.string().optional(),
    MAIL_PORT: z.coerce.number().optional(),
    MAIL_USERNAME: z.string().optional(),
    MAIL_PASSWORD: z.string().optional(),
    MAIL_FROM: z.string().optional(),
    MAIL_DISPLAY_NAME: z.string().optional(),
  })
  .readonly();

export type TConfig = z.infer<typeof configSchema>;

export const config = configSchema.parse(process.env);

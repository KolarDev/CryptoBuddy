const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
import { config } from "./config/envSchema";

import app from "./app";
import bot from "./bot";

//   CONNECT DATABASE
const DB_LOCAL = config.DATABASE_LOCAL;
mongoose
  .connect(DB_LOCAL)
  .then(() => console.log("Database Connected Succesfully!"));

const port = config.PORT || 9091;

const server = app.listen(port, async () => {
  console.log(`App listening on port ${port}`);

  try {
    await bot.telegram.setWebhook(config.WEBHOOK_URL);
    console.log(`✅ Webhook set successfully: ${config.WEBHOOK_URL}`);
  } catch (error) {
    console.error("❌ Failed to set webhook:", error);
  }
});

process.on("unhandledRejection", (err: unknown) => {
  if (err instanceof Error) {
    console.log(err.name, err.message);
  } else {
    console.log("Unhandled Rejection: ", err);
  }
  console.log("UNHANDLED REJECTION!!! 🔥");

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION!!! 🔥");

  process.exit(1);
});

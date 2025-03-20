"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const envSchema_1 = require("./config/envSchema");
const app_1 = __importDefault(require("./app"));
const bot_1 = __importDefault(require("./bot"));
//   CONNECT DATABASE
const DB_LOCAL = envSchema_1.config.DATABASE_LOCAL;
mongoose
    .connect(DB_LOCAL)
    .then(() => console.log("Database Connected Succesfully!"));
const port = envSchema_1.config.PORT || 9091;
const server = app_1.default.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`App listening on port ${port}`);
    try {
        yield bot_1.default.telegram.setWebhook(envSchema_1.config.WEBHOOK_URL);
        console.log(`✅ Webhook set successfully: ${envSchema_1.config.WEBHOOK_URL}`);
    }
    catch (error) {
        console.error("❌ Failed to set webhook:", error);
    }
}));
process.on("unhandledRejection", (err) => {
    if (err instanceof Error) {
        console.log(err.name, err.message);
    }
    else {
        console.log("Unhandled Rejection: ", err);
    }
    console.log("UNHANDLED REJECTION!!! 🔥");
    server.close(() => {
        process.exit(1);
    });
});
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION!!! 🔥");
    process.exit(1);
});

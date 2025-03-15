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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWebhook = setWebhook;
const axios_1 = require("./axios");
const envSchema_1 = require("./envSchema");
function setWebhook() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const webhookUrl = `${envSchema_1.config.WEBHOOK_URL}/webhook`;
            yield axios_1.axiosInstance.get("setWebhook", {
                params: { url: webhookUrl },
            });
            console.log("✅ Webhook set successfully!");
        }
        catch (error) {
            console.error("❌ Failed to set webhook:", error);
        }
    });
}

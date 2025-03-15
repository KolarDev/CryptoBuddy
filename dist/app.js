"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const webhookRoute_1 = __importDefault(require("./routes/webhookRoute"));
const bot_1 = require("./config/bot");
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// Set Webhook
(0, bot_1.setWebhook)();
app.use("/", webhookRoute_1.default);
app.get("*", (req, res) => {
    // res.send(await handler(req, "GET"));
    res.status(200).json({
        message: "Hey there! from the sever side",
        app: "CryptoBuddy",
    });
});
//
app.post("*", (req, res) => {
    // res.send(await handler(req, "POST"));
    console.log(req.body);
    res.status(200).json({
        message: "Hey post! Webhook working perfectly",
        app: "CryptoBuddy",
    });
});
// Global Error Handler
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;

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
const express_1 = require("express");
const bot_1 = __importDefault(require("./../bot"));
const updateHandler_1 = require("../handlers/updateHandler");
const router = (0, express_1.Router)();
router.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received Telegram request:", req.body);
    try {
        const update = req.body;
        yield (0, updateHandler_1.handleUpdate)(bot_1.default, update);
        res.sendStatus(200);
    }
    catch (err) {
        console.error("❌❌ Error calling webhook:", err);
    }
}));
exports.default = router;

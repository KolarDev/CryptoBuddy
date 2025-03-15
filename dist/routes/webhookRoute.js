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
const express_1 = require("express");
const messageHandler_1 = require("../handlers/messageHandler");
const catchAsync_1 = require("../utils/catchAsync");
const router = (0, express_1.Router)();
router.post("/webhook", (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received Telegram request:", req.body);
    const update = req.body;
    if (update.message) {
        yield (0, messageHandler_1.handleMessage)(update.message);
    }
    res.sendStatus(200);
})));
exports.default = router;

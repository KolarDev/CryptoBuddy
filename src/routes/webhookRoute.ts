import { Router, Request, Response } from "express";
import bot from "./../bot";
import { handleMessage } from "../handlers/messageHandler";
import { catchAsync } from "../utils/catchAsync";
import { handleUpdate } from "../handlers/updateHandler";

const router = Router();

router.post("/webhook", async (req: Request, res: Response) => {
  console.log("Received Telegram request:", req.body);
  try {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌❌ Error calling webhook:", err);
  }
});

export default router;

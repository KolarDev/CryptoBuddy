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

// curl -X POST "https://cryptobuddy-sst6.onrender.com/webhook" \
//      -H "Content-Type: application/json" \
//      -d '{"update_id":123456789, "message":{"message_id":1, "from":{"id":123456, "is_bot":false, "first_name":"Test"}, "chat":{"id":123456, "type":"private"}, "text":"/start"}}'

import { Router, Request, Response, NextFunction } from "express";
import bot from "./../bot";
import { handleMessage } from "../handlers/messageHandler";
import { catchAsync } from "../utils/catchAsync";
import { handleUpdate } from "../handlers/updateHandler";

const router = Router();

router.post(
  "/webhook",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Received Telegram request:", req.body);
    const update = req.body;
    await handleUpdate(bot, update);
    res.sendStatus(200);
  })
);

export default router;

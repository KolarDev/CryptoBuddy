import { Router, Request, Response, NextFunction } from "express";
import { handleMessage } from "../handlers/messageHandler";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

router.post(
  "/webhook",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Received Telegram request:", req.body);
    const update = req.body;
    if (update.message) {
      await handleMessage(update.message);
    }
    res.sendStatus(200);
  })
);

export default router;

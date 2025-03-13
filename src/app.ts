import path from "path";
import express, { Application, Request, Response } from "express";
import bodyparser from "body-parser";
import { config } from "./config/index";
// import { handler } from "./controllers";

const app: Application = express();

app.use(express.json());
app.use(bodyparser.json());

app.get("*", (req: Request, res: Response) => {
  // res.send(await handler(req, "GET"));

  res.status(200).json({
    message: "Hey there! from the sever side",
    app: "CryptoBuddy",
  });
});

//
app.post("*", (req: Request, res: Response) => {
  // res.send(await handler(req, "POST"));

  console.log(req.body);
  res.status(200).json({
    message: "Hey post! Webhook working perfectly",
    app: "CryptoBuddy",
  });
});

export default app;

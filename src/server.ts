const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
import { config } from "./config/index";

import app from "./app";

//   CONNECT DATABASE
const DB_LOCAL = config.DATABASE_LOCAL;
mongoose
  .connect(DB_LOCAL)
  .then(() => console.log("Database Connected Succesfully!"));

const port = config.PORT || 9000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on("unhandledRejection", (err: unknown) => {
  if (err instanceof Error) {
    console.log(err.name, err.message);
  } else {
    console.log("Unhandled Rejection: ", err);
  }
  console.log("UNHANDLED REJECTION!!! 🔥");

  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION!!! 🔥");

  process.exit(1);
});

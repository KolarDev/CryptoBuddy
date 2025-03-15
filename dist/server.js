"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const envSchema_1 = require("./config/envSchema");
const app_1 = __importDefault(require("./app"));
//   CONNECT DATABASE
const DB_LOCAL = envSchema_1.config.DATABASE_LOCAL;
mongoose
    .connect(DB_LOCAL)
    .then(() => console.log("Database Connected Succesfully!"));
const port = envSchema_1.config.PORT || 9091;
const server = app_1.default.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
process.on("unhandledRejection", (err) => {
    if (err instanceof Error) {
        console.log(err.name, err.message);
    }
    else {
        console.log("Unhandled Rejection: ", err);
    }
    console.log("UNHANDLED REJECTION!!! 🔥");
    server.close(() => {
        process.exit(1);
    });
});
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION!!! 🔥");
    process.exit(1);
});

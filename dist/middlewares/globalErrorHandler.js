"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const appError_1 = require("../utils/appError");
const globalErrorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    // If error is not an instance of AppError, treat it as a server error
    if (!(err instanceof appError_1.AppError)) {
        statusCode = 500;
        message = "Internal Server Error";
    }
    console.error("❌ ERROR:", err);
    res.status(statusCode).json({
        status: "error",
        message,
    });
};
exports.globalErrorHandler = globalErrorHandler;

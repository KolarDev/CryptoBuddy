import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, message } = err;

  // If error is not an instance of AppError, treat it as a server error
  if (!(err instanceof AppError)) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  console.error("❌ ERROR:", err);

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export { globalErrorHandler };

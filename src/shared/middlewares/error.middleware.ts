import { NextFunction, Request, Response } from "express";
import AppError from "../helpers/AppError";
import LoggerService from "../services/Logger.service";
import ApiStatus from "../types/apiStatus.enum";
import config from "../config/config";
const logger = new LoggerService("errorController");

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const message = `Duplicate field value: "${err.keyValue.name}" Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid Input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again", 401);

const sendErrorDev = (err: any, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  return res.status(500).json({
    status: ApiStatus.ERROR,
    message: "Something went very wrong!",
  });
};

const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || ApiStatus.ERROR;

  // 1) Log error
  logger.log("error", err.message, err);
  if (config.nodeEnv === "development") {
    sendErrorDev(err, req, res);
  } else if (config.nodeEnv === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export default ErrorMiddleware;

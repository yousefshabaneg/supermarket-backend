import { Request, Response, NextFunction } from "express";
import LoggerService from "../services/Logger.service";

type catchAsyncFnType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

const catchAsync = (fn: catchAsyncFnType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      next(err);
    });
  };
};

export const generateCatchAsyncWithLogger = (logger: LoggerService) => {
  return function catchAsync(fn: catchAsyncFnType) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch((err: any) => {
        if (logger) logger.log("error", err.message, err);
        next(err);
      });
    };
  };
};

export default catchAsync;

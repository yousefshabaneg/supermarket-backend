import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import AppError from "../helpers/AppError";

const ValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw AppError.InvalidDataException(`Validation Error`, errors.array());
  }

  next();
};

export default ValidatorMiddleware;

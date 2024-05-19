import { check } from "express-validator";

export const mongoIdChain = (field = "id") =>
  check(field)
    .notEmpty()
    .withMessage(field + " is required")
    .isMongoId()
    .withMessage("enter a valid mongo id");

export const nameChain = (field = "name") =>
  check(field)
    .isString()
    .withMessage(`enter a valid ${field}`)
    .isLength({ min: 3 })
    .withMessage(`${field} must be at least 3 characters`)
    .isLength({ max: 64 })
    .withMessage(`${field} must be less than 64 characters`);

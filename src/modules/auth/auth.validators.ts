import { check } from "express-validator";
import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Enter a valid email address"),
  check("password")
    .notEmpty()
    .withMessage("password field is required")
    .isLength({ min: 6 })
    .withMessage("password field must be at least 6 characters"),
  ValidatorMiddleware,
];

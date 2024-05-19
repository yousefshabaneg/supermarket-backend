import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";
import { mongoIdChain } from "../../shared/helpers/validatorsChains";
import { check } from "express-validator";
import AppError from "../../shared/helpers/AppError";

export const receiptIdValidator = [mongoIdChain(), ValidatorMiddleware];

export const createReceiptValidator = [
  mongoIdChain("cashierId"),
  mongoIdChain("branchId"),
  check("date").isISO8601().toDate(),
  check("items")
    .isArray({ min: 1 })
    .withMessage("items must contains at least one item"),
  ValidatorMiddleware,
];

export const filterReceiptsByDateRangeValidator = [
  check("startDate")
    .notEmpty()
    .withMessage("startDate is required")
    .isISO8601()
    .toDate(),
  check("endDate")
    .notEmpty()
    .withMessage("endDate is required")
    .isISO8601()
    .toDate()
    .custom((val, { req }) => {
      if (val < req.query?.startDate) {
        throw AppError.InvalidDataException(
          "endDate should be greater than or equal to startDate"
        );
      }
      return true;
    }),
  ValidatorMiddleware,
];

export const filterReceiptsByProductDetailsValidator = [
  check("categoryId")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .optional(),
  check("name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product name required")
    .optional(),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 2_000_000 })
    .withMessage("Product price must be not exceed 2 million")
    .optional(),
  ValidatorMiddleware,
];

export const updateReceiptValidator = [
  mongoIdChain("cashierId").optional(),
  mongoIdChain("branchId").optional(),
  check("date").optional().isISO8601().toDate(),
  ValidatorMiddleware,
];

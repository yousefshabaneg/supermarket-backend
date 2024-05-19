import { body, check } from "express-validator";
import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";
import { mongoIdChain } from "../../shared/helpers/validatorsChains";
import { CategoryModel } from "../category";

const categoryIdExistsValidator = () => {
  return check("categoryId")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) => {
      return CategoryModel.throwIfCategoryIdNotExist(categoryId);
    });
};

export const createProductValidator = [
  categoryIdExistsValidator(),
  check("name")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product name required"),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 2_000_000 })
    .withMessage("Product price must be not exceed 2 million"),

  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),

  ValidatorMiddleware,
];

export const productIdValidator = [mongoIdChain(), ValidatorMiddleware];

export const updateProductValidator = [
  mongoIdChain(),
  body("name").optional(),
  body("price").optional().isNumeric().isLength({ max: 2_000_000 }),
  categoryIdExistsValidator().optional(),
  ValidatorMiddleware,
];

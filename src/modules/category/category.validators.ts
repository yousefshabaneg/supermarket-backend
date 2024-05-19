import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";
import { mongoIdChain, nameChain } from "../../shared/helpers/validatorsChains";

export const categoryIdValidator = [mongoIdChain(), ValidatorMiddleware];

export const createCategoryValidator = [nameChain(), ValidatorMiddleware];

export const updateCategoryValidator = [
  mongoIdChain(),
  nameChain().optional(),
  ValidatorMiddleware,
];

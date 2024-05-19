import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";
import { mongoIdChain, nameChain } from "../../shared/helpers/validatorsChains";

export const branchIdValidator = [mongoIdChain(), ValidatorMiddleware];

export const createBranchValidator = [nameChain(), ValidatorMiddleware];

export const updateBranchValidator = [
  mongoIdChain(),
  nameChain().optional(),
  ValidatorMiddleware,
];

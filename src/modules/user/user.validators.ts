import ValidatorMiddleware from "../../shared/middlewares/validatorMiddleware";
import { mongoIdChain, nameChain } from "../../shared/helpers/validatorsChains";
import { check } from "express-validator";
import UserModel from "./user.model";
import AppError from "../../shared/helpers/AppError";
import { validateRole } from "../../shared/types/userRoles.enum";

const validateEmail = async (email: string) => {
  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist)
    throw AppError.InvalidDataException(
      "email already exist, try another email"
    );

  return true;
};

export const userEmailValidator = () => {
  return check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .custom(validateEmail);
};

const userPasswordValidator = () => {
  return check("password")
    .notEmpty()
    .withMessage("password field is required")
    .isLength({ min: 6 })
    .withMessage("password field must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw AppError.InvalidDataException(
          "password and passwordConfirm are not match"
        );
      }
      return true;
    });
};

export const userIdValidator = [mongoIdChain(), ValidatorMiddleware];

export const createUserValidator = [
  nameChain(),
  userEmailValidator(),
  userPasswordValidator(),
  check("image").optional(),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm field is required"),
  check("role").optional().custom(validateRole),
  ValidatorMiddleware,
];

export const updateUserValidator = [
  mongoIdChain(),
  nameChain().optional(),
  ValidatorMiddleware,
];

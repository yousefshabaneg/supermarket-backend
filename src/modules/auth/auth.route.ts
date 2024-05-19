import express from "express";
import AuthController from "./auth.controller";
import { createUserValidator } from "../user/user.validators";
import { loginValidator } from "./auth.validators";
import MulterMiddleware from "../../shared/middlewares/multer.middleware";
import UserController from "../user/user.controller";

const AuthRouter = express.Router();

AuthRouter.post(
  "/signup",
  MulterMiddleware.uploadSingleImage(),
  UserController.resizeImage,
  createUserValidator,
  AuthController.signup
);
AuthRouter.post("/login", loginValidator, AuthController.login);

export default AuthRouter;

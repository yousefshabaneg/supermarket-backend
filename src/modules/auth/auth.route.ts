import express from "express";
import AuthController from "./auth.controller";
import { createUserValidator } from "../user/user.validators";
import { loginValidator } from "./auth.validators";
import MulterMiddleware from "../../shared/middlewares/multer.middleware";
import UserController from "../user/user.controller";
import S3Middleware from "../../shared/middlewares/s3.middleware";

const AuthRouter = express.Router();

AuthRouter.post(
 "/signup",
 MulterMiddleware.uploadSingleImage(),
 S3Middleware.uploadImageToS3,
 createUserValidator,
 AuthController.signup
);
AuthRouter.post("/login", loginValidator, AuthController.login);

export default AuthRouter;

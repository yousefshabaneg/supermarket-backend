import express from "express";
import UserController from "./user.controller";
import {
  userIdValidator,
  createUserValidator,
  updateUserValidator,
} from "./user.validators";
import MulterMiddleware from "../../shared/middlewares/multer.middleware";
import AuthMiddleware from "../auth/auth.middleware";
import UserRoles from "../../shared/types/userRoles.enum";

const CashierRouter = express.Router();

CashierRouter.use(AuthMiddleware.protect);
CashierRouter.use(AuthMiddleware.restrictTo(UserRoles.Admin));

CashierRouter.route("/allCashiers").get(
  UserController.addCashierToFilter,
  UserController.getAllUsers
);

CashierRouter.route("/allAdmins").get(
  UserController.addAdminToFilter,
  UserController.getAllUsers
);

CashierRouter.route("/")
  .get(UserController.getAllUsers)
  .post(
    MulterMiddleware.uploadSingleImage(),
    UserController.resizeImage,
    createUserValidator,
    UserController.createUser
  );

CashierRouter.route("/:id")
  .get(userIdValidator, UserController.getUserById)
  .delete(userIdValidator, UserController.deleteUser)
  .patch(
    MulterMiddleware.uploadSingleImage(),
    UserController.resizeImage,
    updateUserValidator,
    UserController.updateUser
  );

export default CashierRouter;

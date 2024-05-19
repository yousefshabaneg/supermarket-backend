import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/helpers/catchAsync";
import UserModel, { IUser } from "../user/user.model";

class AuthController {
  static login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      const user: IUser = await UserModel.login(email, password);
      const token = await user.generateToken();

      res.json({
        status: "success",
        message: "User logged successfully",
        token,
        data: user,
      });
    }
  );

  static signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const newUser: IUser = await UserModel.create(req.body);
      const token = await newUser.generateToken();
      res.json({
        status: "success",
        message: "User created successfully",
        token,
        data: newUser,
      });
    }
  );
}

export default AuthController;

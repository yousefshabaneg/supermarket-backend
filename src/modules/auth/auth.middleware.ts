import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/helpers/catchAsync";
import AppError from "../../shared/helpers/AppError";
import UserModel from "../user/user.model";
import { UserRoleType } from "../../shared/types/userRoles.enum";

class AuthMiddleware {
  static protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1) Getting token and check if it's there...
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next(
          AppError.NotAuthenticatedException(
            "Unauthorized, please log in to get access."
          )
        );
      }

      // 2) Verification token...
      const { user } = await UserModel.verifyToken(token);

      // 3) Check if user still exists...
      if (!user) {
        return next(
          AppError.NotAuthorizedException("This token is not correct")
        );
      }

      // GRANT ACCESS TO PROTECTED ROUTE...
      req.user = user;

      next();
    }
  );

  static restrictTo = (...roles: UserRoleType[]) => {
    return catchAsync(async (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          AppError.NotAuthorizedException(
            "You do not have permission to perform this action"
          )
        );
      }

      next();
    });
  };
}

export default AuthMiddleware;

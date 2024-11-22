import UserModel from "./user.model";
import ApiFactory from "../../shared/services/ApiFactory.service";
import catchAsync from "../../shared/helpers/catchAsync";
import { NextFunction, Response, Request } from "express";
import sharp from "sharp";
import { uuid } from "uuidv4";

class UserController {
 static userFactory = new ApiFactory("userController", UserModel);

 static resizeImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   if (!req.file?.buffer) return next();

   const filename = `user-${uuid().split("-").pop()}-${Date.now()}.jpeg`;

   //sharping and resizing our image.
   await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/users/${filename}`);

   // Save image into our db
   req.body.image = filename;

   next();
  }
 );

 static addCashierToFilter = (
  req: Request,
  res: Response,
  next: NextFunction
 ) => {
  req.filterObject = { role: "Cashier" };
  next();
 };

 static addAdminToFilter = (
  req: Request,
  res: Response,
  next: NextFunction
 ) => {
  req.filterObject = { role: "Admin" };
  next();
 };
 static getAllUsers = this.userFactory.getAll();
 static getUserById = this.userFactory.getOne();
 static createUser = this.userFactory.createOne();
 static updateUser = this.userFactory.updateOne();
 static deleteUser = this.userFactory.deleteOne();
}

export default UserController;

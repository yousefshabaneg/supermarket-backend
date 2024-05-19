import CategoryModel from "./category.model";
import ApiFactory from "../../shared/services/ApiFactory.service";
import catchAsync from "../../shared/helpers/catchAsync";
import { NextFunction, Request, Response } from "express";
import { uuid } from "uuidv4";
import sharp from "sharp";

class CategoryController {
  static resizeImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.file?.buffer) return next();

      const filename = `category-${uuid().split("-").pop()}-${Date.now()}.jpeg`;

      //sharping and resizing our image.
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/categories/${filename}`);

      // Save image into our db
      req.body.image = filename;

      next();
    }
  );

  static categoryFactory = new ApiFactory("categoryController", CategoryModel);
  static getAllCategories = this.categoryFactory.getAll();
  static getCategoryById = this.categoryFactory.getOne();
  static createCategory = this.categoryFactory.createOne();
  static updateCategory = this.categoryFactory.updateOne();
  static deleteCategory = this.categoryFactory.deleteOne();
}

export default CategoryController;

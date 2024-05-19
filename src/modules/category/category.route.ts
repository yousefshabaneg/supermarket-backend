import express from "express";
import CategoryController from "./category.controller";
import {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from "./category.validators";
import MulterMiddleware from "../../shared/middlewares/multer.middleware";

const CategoryRouter = express.Router();

CategoryRouter.route("/")
  .get(CategoryController.getAllCategories)
  .post(
    MulterMiddleware.uploadSingleImage(),
    createCategoryValidator,
    CategoryController.createCategory
  );

CategoryRouter.route("/:id")
  .get(categoryIdValidator, CategoryController.getCategoryById)
  .delete(categoryIdValidator, CategoryController.deleteCategory)
  .patch(updateCategoryValidator, CategoryController.updateCategory);

export default CategoryRouter;

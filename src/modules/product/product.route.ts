import express from "express";
import ProductController from "./product.controller";
import {
  productIdValidator,
  createProductValidator,
  updateProductValidator,
} from "./product.validators";

const ProductRouter = express.Router();

ProductRouter.route("/")
  .get(ProductController.getAllProducts)
  .post(
    ProductController.uploadProductImages,
    ProductController.resizeProductImages,
    createProductValidator,
    ProductController.createProduct
  );

ProductRouter.route("/:id")
  .get(productIdValidator, ProductController.getProductById)
  .delete(productIdValidator, ProductController.deleteProduct)
  .patch(
    ProductController.uploadProductImages,
    ProductController.resizeProductImages,
    updateProductValidator,
    ProductController.updateProduct
  );

export default ProductRouter;

import ProductModel from "./product.model";
import ApiFactory from "../../shared/services/ApiFactory.service";
import MulterMiddleware from "../../shared/middlewares/multer.middleware";
import { NextFunction, Response, Request } from "express";
import { uuid } from "uuidv4";
import sharp from "sharp";
import catchAsync from "../../shared/helpers/catchAsync";

class ProductController {
  static uploadProductImages = MulterMiddleware.uploadMixOfImages([
    {
      name: "imageCover",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 5,
    },
  ]);

  static resizeProductImages = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files) return next();

      //1- Image processing for imageCover
      if (files.imageCover) {
        const imageCoverFileName = `product-${uuid()
          .split("-")
          .pop()}-${Date.now()}-cover.jpeg`;

        await sharp(files.imageCover[0].buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageCoverFileName}`);

        // Save image into our db
        req.body.imageCover = imageCoverFileName;
      }

      //2- Image processing for images
      if (files.images) {
        req.body.images = [];
        await Promise.all(
          files.images.map(async (img, index) => {
            const imageName = `product-${uuid()
              .split("-")
              .pop()}-${Date.now()}-${index + 1}.jpeg`;

            await sharp(img.buffer)
              .resize(2000, 1333)
              .toFormat("jpeg")
              .jpeg({ quality: 90 })
              .toFile(`uploads/products/${imageName}`);

            // Save image into our db
            req.body.images.push(imageName);
          })
        );
      }

      next();
    }
  );

  static productFactory = new ApiFactory("productController", ProductModel);

  static getAllProducts = this.productFactory.getAll();
  static getProductById = this.productFactory.getOne();
  static createProduct = this.productFactory.createOne();
  static updateProduct = this.productFactory.updateOne();
  static deleteProduct = this.productFactory.deleteOne();
}

export default ProductController;

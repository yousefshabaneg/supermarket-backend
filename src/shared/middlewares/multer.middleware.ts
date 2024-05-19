import multer, { Field, FileFilterCallback, StorageEngine } from "multer";
import { RequestHandler } from "express";
import AppError from "../helpers/AppError";

class MulterMiddleware {
  static configureMulterOptions = (): multer.Multer => {
    const storage: StorageEngine = multer.memoryStorage();

    const fileFilter = (
      req: Express.Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ): void => {
      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        cb(AppError.InvalidDataException("Only Images allowed") as any, false);
      }
    };

    return multer({ storage, fileFilter });
  };

  static uploadSingleImage = (fieldName: string = "image"): RequestHandler => {
    const upload = this.configureMulterOptions().single(fieldName);
    return upload;
  };

  static uploadMixOfImages = (arrayOfFields: Field[]): RequestHandler => {
    const upload = this.configureMulterOptions().fields(arrayOfFields);
    return upload;
  };
}

export default MulterMiddleware;

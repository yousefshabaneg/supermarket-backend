import mongoose, { Document, Model, ObjectId, Query } from "mongoose";
import { ICategory } from "../category/category.model";
import config from "../../shared/config/config";

export interface IProduct extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  images: string[];
  categoryId: ObjectId | ICategory;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is Required"],
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name must be less than 100 characters"],
    },

    description: {
      type: String,
      required: [true, "description is Required"],
      minlength: [20, "description must be at least 20 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is Required"],
    },
    price: {
      type: Number,
      required: [true, "price is Required"],
      max: [2_000_000, "price must be less than 2 million"],
    },

    imageCover: {
      type: String,
      default: "product-image.jpeg",
    },
    images: [String],
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product categoryId is Required"],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre<Query<IProduct[], IProduct, {}>>(
  /^find/,
  async function (next) {
    this.populate({ path: "categoryId", select: "name" });
    next();
  }
);

function convertProductImagesToUrl(doc: IProduct) {
  if (doc.imageCover) {
    const imageCoverUrl = `${config.baseUrl}/products/${doc.imageCover}`;
    doc.imageCover = imageCoverUrl;
  }

  if (doc.images?.length) {
    doc.images = doc.images.map((image) => {
      const imageUrl = `${config.baseUrl}/products/${image}`;
      return imageUrl;
    });
  }
}
// /^find/,update,
productSchema.post<any>("init", convertProductImagesToUrl);

// create
productSchema.post<any>("save", convertProductImagesToUrl);

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;

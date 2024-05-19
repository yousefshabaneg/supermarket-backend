import mongoose, {
  Document,
  Model,
  ObjectId,
  Query,
  isValidObjectId,
} from "mongoose";
import AppError from "../../shared/helpers/AppError";
import HelperFunctions from "../../shared/services/HelperFunctions.service";

export interface ICategory extends Document {
  name: string;
}

interface CategoryModel extends Model<ICategory> {
  throwIfCategoryIdNotExist: (id: ObjectId) => Promise<any>;
}

const categorySchema = new mongoose.Schema<ICategory, CategoryModel>(
  {
    name: {
      type: String,
      required: [true, "Category name is Required"],
      unique: true,
      minlength: [3, "name must be at least 3 characters"],
      maxlength: [64, "name must be less than 64 characters"],
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.statics.throwIfCategoryIdNotExist = async function (
  id: ObjectId
) {
  if (!isValidObjectId(id)) {
    throw AppError.InvalidDataException("Invalid Category Id");
  }

  const isExist = await CategoryModel.findById(id);

  if (!isExist) {
    throw AppError.NotFoundException(`Category with id ${id} does not exist`);
  }

  return true;
};

const CategoryModel = mongoose.model<ICategory, CategoryModel>(
  "Category",
  categorySchema
);

export default CategoryModel;

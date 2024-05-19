import mongoose, { Document } from "mongoose";
import UserModel from "../user/user.model";
import AppError from "../../shared/helpers/AppError";
import UserRoles from "../../shared/types/userRoles.enum";

export interface IBranch extends Document {
  name: string;
  address: string;
  phone: string;
}

const branchSchema = new mongoose.Schema<IBranch>(
  {
    name: {
      type: String,
      required: [true, "Branch name is Required"],
      unique: true,
      minlength: [3, "name must be at least 3 characters"],
      maxlength: [64, "name must be less than 64 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phone: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-remove hook to check for associated cashiers

branchSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (this: any, next) {
    const branchQuery = this.getQuery(); // Get the query
    const branchId = branchQuery._id;
    const cashiers = await UserModel.find({
      branchId,
      role: UserRoles.Cashier,
    });
    if (cashiers.length > 0) {
      throw AppError.InvalidDataException(
        "Cannot delete branch: Cashiers are associated with this branch."
      );
    }

    next();
  }
);

const BranchModel = mongoose.model<IBranch>("Branch", branchSchema);

export default BranchModel;

import mongoose, { Document, Schema, ObjectId, Model } from "mongoose";
import { ReceiptModel } from ".";

export interface IReceiptItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IReceipt extends Document {
  cashierId: ObjectId;
  branchId: ObjectId;
  items: IReceiptItem[];
  totalAmount: number;
  date: Date;
  customerName?: string;
  customerEmail?: string;
}

interface ReceiptModel extends Model<IReceipt> {
  findByDateRange: (startDate: string, endDate: string) => Promise<any>;
  findByProductDetails: (productQuery: any) => Promise<any>;
  getTop3Cashiers: () => Promise<any>;
}

const ReceiptItemSchema: Schema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Schema for the Receipt
const ReceiptSchema = new Schema<IReceipt, ReceiptModel>({
  cashierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  items: { type: [ReceiptItemSchema], required: true },
  totalAmount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  customerName: String,
  customerEmail: String,
});

// Pre-save hook to calculate totalAmount
ReceiptSchema.pre<IReceipt>("save", function (next) {
  const receipt = this;
  receipt.totalAmount = receipt.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  next();
});

ReceiptSchema.statics.findByDateRange = async function (
  start: string,
  end: string
): Promise<IReceipt[]> {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });
};

ReceiptSchema.statics.findByProductDetails = async function (
  productQuery: any
): Promise<IReceipt[]> {
  const matchConditions: any = {};

  if (productQuery.name) {
    matchConditions["productDetails.name"] = productQuery.name;
  }
  if (productQuery.category) {
    matchConditions["productDetails.category"] = productQuery.category;
  }
  if (productQuery.price) {
    matchConditions["productDetails.price"] = productQuery.price;
  }

  return this.aggregate([
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $match: matchConditions,
    },
    {
      $group: {
        _id: "$_id",
        cashierId: { $first: "$cashierId" },
        branchId: { $first: "$branchId" },
        items: {
          $push: {
            productId: "$items.productId",
            quantity: "$items.quantity",
            price: "$items.price",
          },
        },
        totalAmount: { $first: "$totalAmount" },
        date: { $first: "$date" },
        customerName: { $first: "$customerName" },
        customerEmail: { $first: "$customerEmail" },
      },
    },
  ]);
};

ReceiptSchema.statics.getTop3Cashiers = async function (): Promise<IReceipt[]> {
  return this.aggregate([
    {
      $group: {
        _id: "$cashierId",
        purchaseCount: { $sum: 1 },
      },
    },
    {
      $sort: { purchaseCount: -1 },
    },
    {
      $limit: 3,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "cashierDetails",
      },
    },
    {
      $unwind: "$cashierDetails",
    },
    {
      $project: {
        _id: 0,
        cashierId: "$_id",
        name: "$cashierDetails.name",
        email: "$cashierDetails.email",
        purchaseCount: 1,
      },
    },
  ]);
};

const Receipt = mongoose.model<IReceipt, ReceiptModel>(
  "Receipt",
  ReceiptSchema
);

export default Receipt;

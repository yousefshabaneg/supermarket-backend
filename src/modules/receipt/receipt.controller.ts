import ReceiptModel, { IReceipt } from "./receipt.model";
import ApiFactory from "../../shared/services/ApiFactory.service";
import catchAsync from "../../shared/helpers/catchAsync";
import { ProductModel } from "../product";
import ApiStatus from "../../shared/types/apiStatus.enum";

class ReceiptController {
  static receiptFactory = new ApiFactory("receiptController", ReceiptModel);
  static getAllReceipts = this.receiptFactory.getAll();
  static getReceiptById = this.receiptFactory.getOne();
  static updateReceipt = this.receiptFactory.updateOne();
  static deleteReceipt = this.receiptFactory.deleteOne();

  static createReceipt = catchAsync(async (req, res, next) => {
    const data = req.body as IReceipt;

    // 1) Creating the receipt.
    const receipt = await ReceiptModel.create(data);

    // 2) Check if receipt is successeed, then decrease the quantity of the products in db
    if (receipt) {
      const bulkOption = data.items.map((item) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: {
            $inc: { quantity: -item.quantity },
          },
        },
      }));
      await ProductModel.bulkWrite(bulkOption, {});
    }

    res.status(201).json({ status: ApiStatus.SUCCESS, data: receipt });
  });

  static filterReceiptsByDateRange = catchAsync(async (req, res, next) => {
    const { startDate, endDate } = req.query as {
      startDate: string;
      endDate: string;
    };
    const receiptsByDateRange = await ReceiptModel.findByDateRange(
      startDate,
      endDate
    );

    res
      .status(200)
      .json({ status: ApiStatus.SUCCESS, data: receiptsByDateRange });
  });

  static filterReceiptsByProductDetails = catchAsync(async (req, res, next) => {
    const receipts = await ReceiptModel.findByProductDetails(req.query);
    res.status(200).json({ status: ApiStatus.SUCCESS, data: receipts });
  });

  static getTop3Cashiers = catchAsync(async (req, res, next) => {
    const topCashiers = await ReceiptModel.getTop3Cashiers();

    res.status(200).json({ status: ApiStatus.SUCCESS, data: topCashiers });
  });
}

export default ReceiptController;

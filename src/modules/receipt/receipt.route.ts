import express from "express";
import ReceiptController from "./receipt.controller";
import {
  createReceiptValidator,
  updateReceiptValidator,
  receiptIdValidator,
  filterReceiptsByDateRangeValidator,
  filterReceiptsByProductDetailsValidator,
} from "./receipt.validators";
import AuthMiddleware from "../auth/auth.middleware";
import UserRoles from "../../shared/types/userRoles.enum";

const ReceiptRouter = express.Router();

ReceiptRouter.use(AuthMiddleware.protect);

ReceiptRouter.route("/")
  .get(ReceiptController.getAllReceipts)
  .post(
    AuthMiddleware.restrictTo(UserRoles.Cashier),
    createReceiptValidator,
    ReceiptController.createReceipt
  );

ReceiptRouter.get(
  "/filterReceiptsByDateRange",
  filterReceiptsByDateRangeValidator,
  ReceiptController.filterReceiptsByDateRange
);

ReceiptRouter.get(
  "/filterReceiptsByProductDetails",
  filterReceiptsByProductDetailsValidator,
  ReceiptController.filterReceiptsByProductDetails
);

ReceiptRouter.get("/top3-cashiers", ReceiptController.getTop3Cashiers);

ReceiptRouter.route("/:id")
  .get(receiptIdValidator, ReceiptController.getReceiptById)
  .delete(receiptIdValidator, ReceiptController.deleteReceipt)
  .patch(updateReceiptValidator, ReceiptController.updateReceipt);

export default ReceiptRouter;

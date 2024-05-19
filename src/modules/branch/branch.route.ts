import express from "express";
import BranchController from "./branch.controller";
import {
  branchIdValidator,
  createBranchValidator,
  updateBranchValidator,
} from "./branch.validators";

const BranchRouter = express.Router();

BranchRouter.route("/")
  .get(BranchController.getAllBranches)
  .post(createBranchValidator, BranchController.createBranch);

BranchRouter.route("/:id")
  .get(branchIdValidator, BranchController.getBranchById)
  .delete(branchIdValidator, BranchController.deleteBranch)
  .patch(updateBranchValidator, BranchController.updateBranch);

export default BranchRouter;

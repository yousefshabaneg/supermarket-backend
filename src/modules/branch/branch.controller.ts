import BranchModel from "./branch.model";
import ApiFactory from "../../shared/services/ApiFactory.service";

class BranchController {
  static branchFactory = new ApiFactory("branchController", BranchModel);
  static getAllBranches = this.branchFactory.getAll();
  static getBranchById = this.branchFactory.getOne();
  static createBranch = this.branchFactory.createOne();
  static updateBranch = this.branchFactory.updateOne();
  static deleteBranch = this.branchFactory.deleteOne();
}

export default BranchController;

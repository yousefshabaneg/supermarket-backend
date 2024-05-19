import { Model } from "mongoose";
import QueryBuilder from "./QueryBuilder.service";
import ApiStatus from "../types/apiStatus.enum";
import { NextFunction, Request, Response } from "express";
import LoggerService from "./Logger.service";
import { generateCatchAsyncWithLogger } from "../helpers/catchAsync";
import AppError from "../helpers/AppError";
import custom from "../types/custom";

class ApiFactory {
  constructor(public nameOfClass: string, public Model: Model<any>) {}
  logger = new LoggerService(this.nameOfClass);
  catchAsync = generateCatchAsyncWithLogger(this.logger);

  getAll = (searchFields?: string[]) => {
    return this.catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        let filterObject = req.filterObject || {};
        const countDocuments = await this.Model.countDocuments();
        const features = new QueryBuilder(
          this.Model.find(filterObject),
          req.query
        )
          .search(searchFields)
          .filter()
          .sort()
          .select()
          .paginate(countDocuments);
          
        const docs = await features.query;

        this.logger.log("info", "Get All", {
          length: docs.length,
        });

        // SEND RESPONSE
        res.status(200).json({
          status: ApiStatus.SUCCESS,
          pagination: features.paginationResult,
          length: docs.length,
          data: docs,
        });
      }
    );
  };

  getOne = (popOptions?: any) => {
    return this.catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        let query = this.Model.findById(id);
        if (popOptions) query = query.populate(popOptions);

        const doc = await query;

        if (!doc) {
          return next(
            AppError.NotFoundException(`Document with id: ${id} not found `)
          );
        }

        this.logger.log("info", `Document by id: ${id}`, doc);

        res.status(200).json({
          status: ApiStatus.SUCCESS,
          data: doc,
        });
      }
    );
  };

  deleteOne = () => {
    return this.catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const doc = await this.Model.deleteOne({ _id: req.params.id });
        if (!doc.deletedCount) {
          return next(
            AppError.NotFoundException(`No document found with that ID`)
          );
        }

        this.logger.log(
          "info",
          `Document Deleted by id: ${req.params.id}`,
          doc
        );

        res.status(204).json({
          status: ApiStatus.SUCCESS,
          message: "Delete Successfully",
        });
      }
    );
  };

  updateOne = () => {
    return this.catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const doc = await this.Model.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

        if (!doc) {
          return next(
            AppError.NotFoundException("No document found with that ID")
          );
        }

        this.logger.log("info", `Document Updated by id: ${req.params.id}`, {
          updated: doc,
          payload: req.body,
        });

        res.status(200).json({
          status: ApiStatus.SUCCESS,
          data: doc,
          message: "Updated Successfully",
        });
      }
    );
  };

  createOne = () => {
    return this.catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const newDoc = await this.Model.create(req.body);

        this.logger.log("info", `Document Created Successfully`, newDoc);

        res.status(201).json({
          status: ApiStatus.SUCCESS,
          message: "Created Successfully",
          data: newDoc,
        });
      }
    );
  };
}

export default ApiFactory;

import config from "./config";
import mongoose, { MongooseError } from "mongoose";
import LoggerService from "../services/Logger.service";
const connectionString = config.dbUri;
const logger = new LoggerService("database");

const InitializeMongoose = () =>
  mongoose
    .connect(connectionString)
    .then(() => {
      logger.log("info", "DB Connected Successfully");
    })
    .catch((err: MongooseError) => {
      logger.log("error", err.message, err);
    });

export default InitializeMongoose;

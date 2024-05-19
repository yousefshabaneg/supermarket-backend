import config from "./shared/config/config";
import InitializeMongoose from "./shared/config/database";
import app from "./app";
import http from "http";
import LoggerService from "./shared/services/Logger.service";
const logger = new LoggerService("server");

process.on("uncaughtException", (err: Error) => {
  logger.log("error", "UNCAUGHT EXCEPTION 💥 Shutting down...", err);
  process.exit(1);
});

const PORT = config.apiPort;

//Init MongoDb
InitializeMongoose();

//Starting our server
const server = http.createServer(app);
server.listen(PORT, () =>
  console.log(`Server Running on http://localhost:${PORT}`)
);

process.on("unhandledRejection", (err: Error) => {
  if (err.name === "MongoServerError") {
    logger.log("error", "UNHANDLED REJECTION 💥 Shutting down...", err);
    server.close(() => {
      process.exit(1);
    });
  }
});

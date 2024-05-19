import config from "../config/config";
import { createLogger, transports, format, Logger } from "winston";

const dateFormat = () => new Date(Date.now()).toLocaleString();

class LoggerService {
  logger: Logger;

  constructor(public route: string) {
    this.logger = createLogger({
      format: format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${
          info.message
        }
        `;

        if (info.obj)
          message = message + ` | data: ${JSON.stringify(info.obj)}`;

        return message;
      }),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: `${config.loggerPath}/${route}.log`,
        }),
      ],
    });
  }

  async log(level: "info" | "error" | "debug", message: string, obj?: any) {
    if (obj) this.logger.log(level, message, { obj });
    else this.logger.log(level, message);
  }
}

export default LoggerService;

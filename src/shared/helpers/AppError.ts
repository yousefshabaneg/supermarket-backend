import ApiStatus from "../types/apiStatus.enum";

class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  data?: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4")
      ? ApiStatus.FAIL
      : ApiStatus.ERROR;
    this.isOperational = true;
    if (data) this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }

  static NotFoundException = (message: string) => {
    return new AppError(message, 404);
  };

  static InvalidDataException = (message: string, data?: any) => {
    return new AppError(message, 400, data);
  };

  static NotAuthenticatedException = (message?: string) => {
    return new AppError(message ?? "You are not Authenticated.", 401);
  };

  static NotAuthorizedException = (message?: string) => {
    return new AppError(message ?? "You are not Authorized.", 403);
  };

  static ServerException = (message: string) => {
    return new AppError(message, 500);
  };
}

export default AppError;

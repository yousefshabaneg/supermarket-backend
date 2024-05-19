import { Request } from "express";
import "jsonwebtoken";

// Extend the Request interface to include the 'user' property
declare module "express" {
  interface Request {
    user?: any;
    filterObject?: any;
  }
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    user?: any;
  }
}

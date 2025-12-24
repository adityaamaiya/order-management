import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  logger.error(err);

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

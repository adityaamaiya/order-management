import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { UserRole } from "../models/user.model";

export const authorizeRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user || !user.role) {
        throw new AppError(
          "User or role does does not exists",
          httpStatus.UNAUTHORIZED
        );
      }

      if (!allowedRoles.includes(user.role)) {
        throw new AppError(
          "User does not have permissions",
          httpStatus.FORBIDDEN
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

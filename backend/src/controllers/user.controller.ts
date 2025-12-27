import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { UserService } from "../services/user.service";
import { successResponse } from "../utils/response";

const userService = new UserService();

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAll();
    res
      .status(httpStatus.OK)
      .json(successResponse(users, "Users fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const user = await userService.getById(userId);

    res
      .status(httpStatus.OK)
      .json(successResponse(user, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const user = await userService.deactivateUser(userId);

    res
      .status(httpStatus.OK)
      .json(successResponse(user, "User deactivated successfully"));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;

    const user = await userService.getById(userId);

    res
      .status(httpStatus.OK)
      .json(successResponse(user, "User fetched successfully"));
  } catch (error) {
    next(error);
  }
};

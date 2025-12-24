import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { AuthService } from "../services/auth.service";
import { LoginUserDTO, SignUpUserDTO } from "../validations/auth.validation";
import { successResponse } from "../utils/response";

const authService = new AuthService();

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: SignUpUserDTO = req.body;

    const user = await authService.register(data);

    res
      .status(httpStatus.CREATED)
      .json(successResponse(user, "User created successfully"));
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: LoginUserDTO = req.body;

    const result = await authService.login(data);

    res.status(httpStatus.OK).json(successResponse(result, "Login successful"));
  } catch (error) {
    next(error);
  }
};

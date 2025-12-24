import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { verifyToken } from "../utils/jwt";


export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: "Please login to access this resource",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid or expired token",
    });
  }
};

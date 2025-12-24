import  httpStatus  from 'http-status';
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "./appError";

const JWT_SECRET = process.env.JWT_SECRET! || "secrey_key";
const JWT_EXPIRES_IN = "1d";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired token", httpStatus.UNAUTHORIZED);
  }
};

import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import httpStatus from "http-status";

export const validate =
  (schema: ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // "cleaned" data from Zod (which removes extra fields)
    req.body = result.data.body;

    next();
  };

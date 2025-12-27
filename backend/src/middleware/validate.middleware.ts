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

    // Apply cleaned/transformed data from Zod
    req.body = result.data.body;
    if (result.data.query) {
      req.query = result.data.query as typeof req.query;
    }
    if (result.data.params) {
      req.params = result.data.params as typeof req.params;
    }

    next();
  };

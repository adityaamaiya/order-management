import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ProductService } from "../services/product.service";
import { successResponse } from "../utils/response";
import {
  CreateProductDTO,
  UpdateProductDTO,
  GetAllProductsQueryDTO,
  GetProductByIdParamsDTO,
} from "../validations/product.validation";

const productService = new ProductService();

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data: CreateProductDTO = req.body;
    const product = await productService.createProduct(data);

    res
      .status(httpStatus.CREATED)
      .json(successResponse(product, "Product created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query as unknown as GetAllProductsQueryDTO;
    const { page = 1, limit = 10, startDate, endDate, isActive } = query;

    const { products, total } = await productService.getAllProducts({
      page,
      limit,
      startDate,
      endDate,
      isActive,
    });

    const meta = {
      page,
      limit,
      total,
    };

    res
      .status(httpStatus.OK)
      .json(successResponse(products, "Products fetched successfully", meta));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as unknown as GetProductByIdParamsDTO;
    const product = await productService.getProductById(id);

    res
      .status(httpStatus.OK)
      .json(successResponse(product, "Product fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as unknown as GetProductByIdParamsDTO;
    const data: UpdateProductDTO = req.body;
    const product = await productService.updateProduct(id, data);

    res
      .status(httpStatus.OK)
      .json(successResponse(product, "Product updated successfully"));
  } catch (error) {
    next(error);
  }
};

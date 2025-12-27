import { Product } from "../models/product.model";
import {
  CreateProductDTO,
  UpdateProductDTO,
  GetAllProductsQueryDTO,
} from "../validations/product.validation";
import { AppError } from "../utils/appError";
import httpStatus from "http-status";

export class ProductService {
  async createProduct(data: CreateProductDTO) {
    const product = await Product.create(data);
    return product;
  }

  async getAllProducts(query: GetAllProductsQueryDTO) {
    const { page, limit, startDate, endDate, isActive } = query;
    const filter: any = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return { products, total };
  }

  async getProductById(id: string) {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("Product not found", httpStatus.NOT_FOUND);
    }
    return product;
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) {
      throw new AppError("Product not found", httpStatus.NOT_FOUND);
    }
    return product;
  }
}

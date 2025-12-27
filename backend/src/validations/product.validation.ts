import { z } from "zod";
import { paginationQuery, dateRangeQuery } from "../utils/commonQuery";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Product name is required"),
    price: z.number().min(0, "Price must be >= 0"),
    description: z.string().optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    price: z.number().min(0).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getAllProductsSchema = z.object({
  query: z.object({
    ...paginationQuery,
    ...dateRangeQuery,
    isActive: z.coerce.boolean().optional(),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});

// DTOs
export type CreateProductDTO = z.infer<typeof createProductSchema>["body"];
export type UpdateProductDTO = z.infer<typeof updateProductSchema>["body"];
export type UpdateProductParamsDTO = z.infer<
  typeof updateProductSchema
>["params"];
export type GetAllProductsQueryDTO = z.infer<
  typeof getAllProductsSchema
>["query"];
export type GetProductByIdParamsDTO = z.infer<
  typeof getProductByIdSchema
>["params"];

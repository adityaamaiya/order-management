import { z } from "zod";
import { dateRangeQuery, paginationQuery } from "../utils/commonQuery";

const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),

  price: z.number().positive("Price must be greater than 0"),
});

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(orderItemSchema)
      .min(1, "Order must contain at least one item"),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Order ID is required"),
  }),

  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "DELIVERED"]),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Order ID is required"),
  }),
});

export const getMyOrdersSchema = z.object({
  query: z.object({
    ...paginationQuery,
    ...dateRangeQuery,

    status: z
      .enum(["PENDING", "CONFIRMED", "CANCELLED", "DELIVERED"])
      .optional(),
  }),
});

export const getAllOrdersSchema = z.object({
  query: z.object({
    ...paginationQuery,
    ...dateRangeQuery,

    status: z
      .enum(["PENDING", "CONFIRMED", "CANCELLED", "DELIVERED"])
      .optional(),
  }),
});

// DTOs
export type OrderItemDTO = z.infer<typeof orderItemSchema>;
export type CreateOrderDTO = z.infer<typeof createOrderSchema>["body"];
export type UpdateOrderStatusDTO = z.infer<
  typeof updateOrderStatusSchema
>["body"];
export type UpdateOrderStatusParamsDTO = z.infer<
  typeof updateOrderStatusSchema
>["params"];
export type GetOrderByIdParamsDTO = z.infer<
  typeof getOrderByIdSchema
>["params"];
export type GetOrdersQueryDTO = z.infer<typeof getMyOrdersSchema>["query"];

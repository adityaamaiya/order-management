import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { OrderService } from "../services/order.service";
import {
  CreateOrderDTO,
  UpdateOrderStatusDTO,
  GetOrdersQueryDTO,
  GetOrderByIdParamsDTO,
} from "../validations/order.validation";
import { successResponse } from "../utils/response";

const orderService = new OrderService();

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const data: CreateOrderDTO = req.body;

    const order = await orderService.createOrder(userId, data.items);

    res
      .status(httpStatus.CREATED)
      .json(successResponse(order, "Order created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const query = req.query as unknown as GetOrdersQueryDTO;
    const { page = 1, limit = 10 } = query;

    const { orders, total } = await orderService.getMyOrders(userId, query);

    const meta = {
      page,
      limit,
      total,
    };

    res
      .status(httpStatus.OK)
      .json(successResponse(orders, "Orders fetched successfully", meta));
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query as unknown as GetOrdersQueryDTO;
    const { page = 1, limit = 10 } = query;

    const { orders, total } = await orderService.getAllOrders(query);

    const meta = {
      page,
      limit,
      total,
    };

    res
      .status(httpStatus.OK)
      .json(successResponse(orders, "Orders fetched successfully", meta));
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as unknown as GetOrderByIdParamsDTO;
    const data: UpdateOrderStatusDTO = req.body;

    const updatedOrder = await orderService.updateOrderStatus(id, data.status);

    res
      .status(httpStatus.OK)
      .json(successResponse(updatedOrder, "Order status updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as unknown as GetOrderByIdParamsDTO;
    const requester = {
      id: (req as any).user.id,
      role: (req as any).user.role,
    };

    const order = await orderService.getOrderById(id, requester);

    res
      .status(httpStatus.OK)
      .json(successResponse(order, "Order fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as unknown as GetOrderByIdParamsDTO;
    const requester = {
      id: (req as any).user.id,
      role: (req as any).user.role,
    };

    const order = await orderService.cancelOrder(id, requester);

    res
      .status(httpStatus.OK)
      .json(successResponse(order, "Order cancelled successfully"));
  } catch (error) {
    next(error);
  }
};

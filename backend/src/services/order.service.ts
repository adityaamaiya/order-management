import httpStatus from "http-status";
import { AppError } from "../utils/appError";
import { Order, TOrderStatus } from "../models/order.model";
import { Types } from "mongoose";
import {
  OrderItemDTO,
  GetOrdersQueryDTO,
} from "../validations/order.validation";

interface RequesterDTO {
  id: string;
  role: string;
}

export class OrderService {
  async createOrder(userId: string, items: OrderItemDTO[]) {
    if (!items || items.length === 0) {
      throw new AppError("Items cannot be empty", httpStatus.BAD_REQUEST);
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const formattedItems = items.map((item) => ({
      productId: new Types.ObjectId(item.productId),
      quantity: item.quantity,
      price: item.price,
    }));

    const newOrder = await Order.create({
      user: new Types.ObjectId(userId),
      items: formattedItems,
      totalAmount,
    });

    return newOrder;
  }

  async getAllOrders(query: GetOrdersQueryDTO) {
    const { page, limit, status, startDate, endDate } = query;
    const filter: any = {};

    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email"),

      Order.countDocuments(filter),
    ]);

    return { orders, total };
  }

  async getMyOrders(userId: string, query: GetOrdersQueryDTO) {
    const { page, limit, status, startDate, endDate } = query;
    const filter: any = { user: userId };

    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = startDate;
      if (endDate) filter.createdAt.$lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email"),

      Order.countDocuments(filter),
    ]);

    return { orders, total };
  }

  async updateOrderStatus(orderId: string, status: TOrderStatus) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );

    if (!order) {
      throw new AppError("Order does not exist", httpStatus.NOT_FOUND);
    }

    return order;
  }

  async getOrderById(orderId: string, requester: RequesterDTO) {
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) {
      throw new AppError("Order does not exist", httpStatus.NOT_FOUND);
    }
    if (
      requester.role !== "ADMIN" &&
      order.user._id.toString() !== requester.id
    ) {
      throw new AppError("Forbidden", httpStatus.FORBIDDEN);
    }
    return order;
  }

  async cancelOrder(orderId: string, requester: RequesterDTO) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError("Order does not exist", httpStatus.NOT_FOUND);
    }
    if (order.user._id.toString() !== requester.id) {
      throw new AppError("Forbidden", httpStatus.FORBIDDEN);
    }

    if (order.status !== "PENDING") {
      throw new AppError(
        "Only pending order can be cancelled",
        httpStatus.NOT_MODIFIED
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "CANCELLED" },
      { new: true }
    );

    return updatedOrder;
  }
}

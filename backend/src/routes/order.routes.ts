import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/authorize.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
} from "../controllers/order.controller";

import {
  createOrderSchema,
  getAllOrdersSchema,
  getMyOrdersSchema,
  updateOrderStatusSchema,
  getOrderByIdSchema,
} from "../validations/order.validation";

const router = Router();

router.use(isAuth);

router.post("/", validate(createOrderSchema), createOrder);

router.get("/me", validate(getMyOrdersSchema), getMyOrders);

router.get(
  "/",
  authorizeRoles(["ADMIN"]),
  validate(getAllOrdersSchema),
  getAllOrders
);

router.get("/:id", validate(getOrderByIdSchema), getOrderById);

router.patch(
  "/:id/status",
  authorizeRoles(["ADMIN"]),
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

router.patch("/:id/cancel", validate(getOrderByIdSchema), cancelOrder);

export default router;

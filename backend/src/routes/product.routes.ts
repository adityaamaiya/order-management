import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/authorize.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller";

import {
  createProductSchema,
  getAllProductsSchema,
  getProductByIdSchema,
  updateProductSchema,
} from "../validations/product.validation";

const router = Router();


router.get("/", validate(getAllProductsSchema), getAllProducts);
router.get("/:id", validate(getProductByIdSchema), getProductById);


router.post(
  "/",
  isAuth,
  authorizeRoles(["ADMIN"]),
  validate(createProductSchema),
  createProduct
);

router.patch(
  "/:id",
  isAuth,
  authorizeRoles(["ADMIN"]),
  validate(updateProductSchema),
  updateProduct
);

export default router;

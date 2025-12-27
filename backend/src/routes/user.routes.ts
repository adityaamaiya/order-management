import {
  deactivateUser,
  getAllUsers,
  getMe,
  getUserById,
} from "../controllers/user.controller";
import { authorizeRoles } from "../middleware/authorize.middleware";
import { isAuth } from "./../middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.use(isAuth);

router.get("/me", getMe);

router.get("/", authorizeRoles(["ADMIN"]), getAllUsers);

router.get("/:id", authorizeRoles(["ADMIN"]), getUserById);

router.patch("/:id/deactivate", authorizeRoles(["ADMIN"]), deactivateUser);

export default router;

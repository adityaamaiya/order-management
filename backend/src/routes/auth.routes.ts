import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { signupSchema, loginSchema } from "../validations/auth.validation";
import { login, me, signup } from "../controllers/auth.controller";
import { isAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", isAuth, me);

export default router;
import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { signupSchema,loginSchema } from "../validations/auth.validation";
import { login, signup } from "../controllers/auth.controller";


const router = Router();

router.post("/signup",validate(signupSchema),signup);
router.post("/login", validate(loginSchema), login);

export default router;
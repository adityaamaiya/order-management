import { isAuth } from "./../middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.get("/me", isAuth, (req, res) => {
  res.json({
    success: true,
    user: (req as any).user,
  });
});

export default router;

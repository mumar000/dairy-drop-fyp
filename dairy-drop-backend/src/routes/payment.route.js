import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  verifyCheckoutSession,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/checkout-session", authenticate, createCheckoutSession);
router.get(
  "/checkout-session/:sessionId/verify",
  authenticate,
  verifyCheckoutSession,
);

export default router;

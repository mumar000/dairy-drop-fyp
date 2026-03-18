import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const router = Router();

router.post("/checkout-session", authenticate, createCheckoutSession);

export default router;

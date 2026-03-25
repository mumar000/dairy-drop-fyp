import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  verifyCheckoutSession,
  markCheckoutSessionFailed,
  adminApproveRefundRequest,
  adminRejectRefundRequest,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/checkout-session", authenticate, createCheckoutSession);
router.get("/checkout-session/:sessionId/verify", authenticate, verifyCheckoutSession);
router.post("/checkout-session/:sessionId/fail", authenticate, markCheckoutSessionFailed);
router.post("/orders/:id/refund/approve", authenticate, authorize("admin"), adminApproveRefundRequest);
router.post("/orders/:id/refund/reject", authenticate, authorize("admin"), adminRejectRefundRequest);

export default router;

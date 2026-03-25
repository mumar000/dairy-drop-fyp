import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  getAdminNotifications,
  markAdminNotificationsRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/admin", authenticate, authorize("admin"), getAdminNotifications);
router.post(
  "/admin/read",
  authenticate,
  authorize("admin"),
  markAdminNotificationsRead,
);

export default router;

import { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["refund_request", "refund_approved", "refund_rejected"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    recipientRole: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

NotificationSchema.index({ recipientRole: 1, isRead: 1, createdAt: -1 });

export const Notification = model("Notification", NotificationSchema);

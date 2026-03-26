import { createHash } from "node:crypto";
import { asyncHandler } from "../utils/async-handler.js";
import { stripe } from "../utils/stripe.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { env } from "../config/env.js";
import { finalizeStripeOrder } from "./webhook.controller.js";
import { Notification } from "../models/notification.model.js";
import { refundReviewSchema } from "../validators/order.schema.js";
import { getIo } from "../socket/index.js";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.cart.length)
    return res.status(400).json({ message: "Cart is empty" });

  // Recalculate cart totals server-side
  const productIds = user.cart.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });

  const lineItems = user.cart.map((item) => {
    const product = products.find(
      (product) => String(product._id) === String(item.product),
    );
    if (!product) {
      throw Object.assign(new Error(`Product not found: ${item.name}`), {
        status: 404,
      });
    }
    if (!product.isActive) {
      throw Object.assign(new Error(`Product inactive: ${product.name}`), {
        status: 400,
      });
    }
    if (product.inStock < item.quantity) {
      throw Object.assign(new Error(`Insufficient stock for ${product.name}`), {
        status: 400,
      });
    }

    return {
      quantity: item.quantity,
      price_data: {
        currency: env.STRIPE_CURRENCY,
        unit_amount: product.price * 100,
        product_data: {
          name: product.name,
          images: product.images?.length ? [product.images[0]] : [],
        },
      },
    };
  });

  const totalAmount = user.cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  const orderItems = user.cart.map((item) => ({
    product: item.product,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  }));

  const checkoutFingerprint = createHash("sha256")
    .update(
      JSON.stringify({
        address: req.body.address,
        items: orderItems.map((item) => ({
          product: String(item.product),
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        successUrl: env.CLIENT_URL_SUCCESS,
        cancelUrl: env.CLIENT_URL_CANCEL,
      }),
    )
    .digest("hex");

  // 1) Try to find existing pending Stripe order for this user
  let order = await Order.findOne({
    user: userId,
    paymentMethod: "Stripe",
    paymentStatus: "Unpaid",
    status: "Pending",
  });

  if (
    order?.stripeSessionId &&
    order.stripeCheckoutFingerprint === checkoutFingerprint
  ) {
    try {
      const existingSession = await stripe.checkout.sessions.retrieve(
        order.stripeSessionId,
      );
      if (existingSession?.url) {
        return res.status(200).json({ url: existingSession.url });
      }
    } catch (error) {
      // Ignore and create a fresh session below if needed.
    }
  }

  // 2) If none exists, create a new pending order
  if (!order) {
    order = await Order.create({
      user: userId,
      items: orderItems,
      address: req.body.address,
      totalAmount,
      status: "Pending",
      paymentMethod: "Stripe",
      paymentStatus: "Unpaid",
      stripeCheckoutFingerprint: checkoutFingerprint,
    });
  } else {
    order.address = req.body.address;
    order.items = orderItems;
    order.totalAmount = totalAmount;
    order.stripeCheckoutFingerprint = checkoutFingerprint;
    await order.save();
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${env.CLIENT_URL_SUCCESS}${
        env.CLIENT_URL_SUCCESS.includes("?") ? "&" : "?"
      }session_id={CHECKOUT_SESSION_ID}&stripe=success`,
      cancel_url: `${env.CLIENT_URL_CANCEL}${
        env.CLIENT_URL_CANCEL.includes("?") ? "&" : "?"
      }stripe=cancelled`,
      metadata: {
        orderId: String(order._id),
        userId: String(user._id),
      },
    },
    {
      idempotencyKey: `${order._id}:${checkoutFingerprint}`,
    },
  );

  order.stripeSessionId = session.id;
  await order.save();

  res.status(200).json({ url: session.url });
});

export const verifyCheckoutSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    return res
      .status(400)
      .json({ message: "Stripe session is missing order metadata" });
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user.id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (session.payment_status === "paid") {
    await finalizeStripeOrder(order, session.payment_intent);
  }

  res.json({
    order,
    paymentStatus: session.payment_status,
  });
});

export const markCheckoutSessionFailed = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    return res
      .status(400)
      .json({ message: "Stripe session is missing order metadata" });
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user.id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.paymentStatus === "Unpaid") {
    order.paymentStatus = "Failed";
    order.paymentFailureReason =
      "Customer cancelled or payment was not completed";
    await order.save();
  }

  res.json({ order });
});

export const adminApproveRefundRequest = asyncHandler(async (req, res) => {
  const { note } = refundReviewSchema.parse(req.body);
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.paymentMethod !== "Stripe") {
    return res
      .status(400)
      .json({ message: "Only Stripe orders can be refunded" });
  }

  if (order.paymentStatus !== "RefundRequested") {
    return res
      .status(400)
      .json({ message: "This order does not have a pending refund request" });
  }

  if (!order.stripePaymentIntentId) {
    return res
      .status(400)
      .json({ message: "Missing Stripe payment intent ID" });
  }

  const refund = await stripe.refunds.create({
    payment_intent: order.stripePaymentIntentId,
    reason: order.refundReason || "requested_by_customer",
    metadata: {
      orderId: String(order._id),
    },
  });

  order.paymentStatus =
    refund.status === "succeeded" ? "Refunded" : "RefundPending";
  order.stripeRefundId = refund.id;
  order.refundReviewedAt = new Date();
  order.refundReviewedBy = req.user.id;
  order.refundAdminNote = note || "Refund approved";
  order.refundedAt = refund.status === "succeeded" ? new Date() : undefined;
  await order.save();

  await Notification.create({
    type: "refund_approved",
    title: "Refund approved",
    message: `Your refund request for order ${order._id} was approved.`,
    order: order._id,
    actor: req.user.id,
    recipientRole: "user",
  });

  try {
    const io = getIo();

    io.to("admins").emit("admin-notification-update", {
      type: "refund_approved",
      title: "Refund approved",
      message: `Refund approved for order ${order._id}.`,
      orderId: String(order._id),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    // ignore when socket server is not available
    console.log(error);
  }

  res.json({ order, refund });
});

export const adminRejectRefundRequest = asyncHandler(async (req, res) => {
  const { note } = refundReviewSchema.parse(req.body);

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.paymentStatus !== "RefundRequested") {
    return res
      .status(400)
      .json({ message: "This order does not have a pending refund request" });
  }

  order.paymentStatus = "RefundRejected";
  order.refundReviewedAt = new Date();
  order.refundReviewedBy = req.user.id;
  order.refundAdminNote = note || "Refund request rejected";
  await order.save();

  await Notification.create({
    type: "refund_rejected",
    title: "Refund request rejected",
    message: `Your refund request for order ${order._id} was rejected.`,
    order: order._id,
    actor: req.user.id,
    recipientRole: "user",
  });

  try {
    const io = getIo();

    io.to("admins").emit("admin-notification-update", {
      type: "refund_rejected",
      title: "Refund rejected",
      message: `Refund rejected for order ${order._id}.`,
      orderId: String(order._id),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    // ignore when socket server is not available
    console.log(error);
  }

  res.json({ order });
});

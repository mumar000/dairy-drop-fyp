import { stripe } from "../utils/stripe.js";
import { env } from "../config/env.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export const finalizeStripeOrder = async (order, paymentIntentId) => {
  if (!order || order.paymentStatus === "Paid") {
    return order;
  }

  order.paymentStatus = "Paid";
  order.stripePaymentIntentId = paymentIntentId;
  order.paymentFailureReason = undefined;
  await order.save();

  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product, inStock: { $gte: item.quantity } },
      { $inc: { inStock: -item.quantity } },
    );
  }

  const user = await User.findById(order.user);
  if (user) {
    const existingAddressIndex = user.addresses.findIndex(
      (addr) =>
        addr.line1 === order.address.line1 &&
        addr.city === order.address.city &&
        addr.postalCode === order.address.postalCode,
    );

    if (existingAddressIndex === -1) {
      user.addresses.push({
        ...order.address.toObject(),
        label: order.address.name,
        isDefault: user.addresses.length === 0,
      });
    }

    user.cart = [];
    await user.save();
  }

  return order;
};

const markOrderFailed = async (order, reason) => {
  if (!order || order.paymentStatus === "Paid" || order.paymentStatus === "Refunded") {
    return order;
  }

  order.paymentStatus = "Failed";
  order.paymentFailureReason = reason;
  await order.save();
  return order;
};

const syncRefund = async (refund) => {
  const paymentIntentId = refund.payment_intent;
  if (!paymentIntentId) return;

  const order = await Order.findOne({ stripePaymentIntentId: paymentIntentId });
  if (!order) return;

  order.stripeRefundId = refund.id;
  order.refundReason = refund.reason || order.refundReason;

  if (refund.status === "succeeded") {
    order.paymentStatus = "Refunded";
    order.refundedAt = new Date();
  } else if (refund.status === "failed" || refund.status === "canceled") {
    order.paymentStatus = "RefundFailed";
  } else {
    order.paymentStatus = "RefundPending";
  }

  await order.save();
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await Order.findById(orderId);
      await finalizeStripeOrder(order, session.payment_intent);
    }
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await Order.findById(orderId);
      await markOrderFailed(order, "Async payment failed");
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await Order.findById(orderId);
      await markOrderFailed(order, "Checkout session expired");
    }
  }

  if (event.type === "refund.updated") {
    const refund = event.data.object;
    await syncRefund(refund);
  }

  res.json({ received: true });
};

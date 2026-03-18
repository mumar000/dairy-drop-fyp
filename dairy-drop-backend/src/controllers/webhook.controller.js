import { stripe } from "../utils/stripe.js";
import { env } from "../config/env.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);

      if (order && order.paymentStatus !== "Paid") {
        order.paymentStatus = "Paid";
        order.stripePaymentIntentId = session.payment_intent;
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
      }
    }
  }

  res.json({ received: true });
};

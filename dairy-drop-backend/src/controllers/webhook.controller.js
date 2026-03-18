import { stripe } from "../utils/stripe.js";
import { env } from "../config/env.js";
import { Order } from "../models/order.model.js";

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
      await Order.updateOne(
        { _id: orderId },
        {
          $set: {
            paymentStatus: "Paid",
            stripePaymentIntentId: session.payment_intent,
          },
        },
      );
    }
  }

  res.json({ received: true });
};
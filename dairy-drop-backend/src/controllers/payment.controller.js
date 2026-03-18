import { asyncHandler } from "../utils/async-handler.js";
import { stripe } from "../utils/stripe.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { env } from "../config/env.js";

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

  // 1) Try to find existing pending Stripe order for this user
  let order = await Order.findOne({
    user: userId,
    paymentMethod: "Stripe",
    paymentStatus: "Unpaid",
    status: "Pending",
  });

  if (order?.stripeSessionId) {
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
      items: user.cart.map((item) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      address: req.body.address,
      totalAmount,
      status: "Pending",
      paymentMethod: "Stripe",
      paymentStatus: "Unpaid",
    });
  } else {
    // Optional: update address and items if changed
    order.address = req.body.address;
    order.items = user.cart.map((item) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));
    order.totalAmount = totalAmount;
    await order.save();
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: env.CLIENT_URL_SUCCESS,
    cancel_url: env.CLIENT_URL_CANCEL,
    metadata: {
      orderId: String(order._id),
      userId: String(user._id),
    },
  }, {
    idempotencyKey: String(order._id)
  });

  order.stripeSessionId = session.id;
  await order.save();

  res.status(200).json({ url: session.url });
});

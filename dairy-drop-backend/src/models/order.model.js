import mongoose, { Schema, model } from 'mongoose';

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderAddressSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: String,
  postalCode: String,
  country: { type: String, required: true },
});

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    address: { type: OrderAddressSchema, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
    paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });

export const Order = model('Order', OrderSchema);
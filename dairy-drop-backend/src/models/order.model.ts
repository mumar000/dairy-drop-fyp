import mongoose, { Schema, model } from 'mongoose';

export type OrderItem = {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
};

export type OrderAddress = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
};

export interface IOrder extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  address: OrderAddress;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'COD';
  paymentStatus: 'Unpaid' | 'Paid';
}

const OrderItemSchema = new Schema<OrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const OrderAddressSchema = new Schema<OrderAddress>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: String,
  postalCode: String,
  country: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
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

export const Order = model<IOrder>('Order', OrderSchema);


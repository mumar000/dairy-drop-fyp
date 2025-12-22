import mongoose, { Schema, model } from 'mongoose';

export type Address = {
  _id: mongoose.Types.ObjectId;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
};

export type CartItem = {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
};

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  addresses: Address[];
  cart: CartItem[];
}

const AddressSchema = new Schema<Address>(
  {
    label: String,
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: String,
    postalCode: String,
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const CartItemSchema = new Schema<CartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    addresses: { type: [AddressSchema], default: [] },
    cart: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { unique: true });

export const User = model<IUser>('User', UserSchema);


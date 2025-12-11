import { env } from '../config/env.js';
import { User } from '../models/user.model.js';

export async function ensureAdmin() {
  if (!env.ADMIN_EMAIL) return;
  const user = await User.findOne({ email: env.ADMIN_EMAIL });
  if (user && user.role !== 'admin') {
    user.role = 'admin';
    await user.save();
    console.log(`Promoted ${env.ADMIN_EMAIL} to admin`);
  }
}


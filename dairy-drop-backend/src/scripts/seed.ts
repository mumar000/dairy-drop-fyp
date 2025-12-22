import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { connectToDatabase } from '../db/connection.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';

function randomDigits(n: number) {
  let s = '';
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10).toString();
  return s;
}

async function seedAdmin() {
  if (!env.ADMIN_EMAIL) {
    console.warn('ADMIN_EMAIL not set; skipping admin seed');
    return;
  }

  const email = env.ADMIN_EMAIL;
  const phone = process.env.ADMIN_PHONE || `9${randomDigits(9)}`; // 10 digits
  let password = process.env.ADMIN_PASSWORD;
  let generated = false;
  if (!password) {
    password = `Adm!n-${Math.random().toString(36).slice(2, 8)}-${randomDigits(3)}`;
    generated = true;
  }

  const hash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });
  if (!existing) {
    const admin = await User.create({
      name: 'Administrator',
      email,
      phone,
      password: hash,
      role: 'admin',
      addresses: [],
      cart: [],
    });
    console.log(`Created admin: ${admin.email}`);
  } else {
    if (existing.role !== 'admin') existing.role = 'admin';
    existing.phone = existing.phone || phone;
    if (process.env.ADMIN_PASSWORD) existing.password = hash; // only reset if provided
    await existing.save();
    console.log(`Ensured admin role for: ${existing.email}`);
  }
  if (generated) console.log(`Generated ADMIN_PASSWORD: ${password}`);
}

async function seedProducts() {
  const count = await Product.estimatedDocumentCount();
  if (count > 0) {
    console.log(`Products exist (${count}); skipping sample insert`);
    return;
  }

  const items = [
    {
      name: 'Fresh Cow Milk 1L',
      description: 'Pure fresh cow milk, pasteurized. Ideal for daily use.',
      images: [],
      price: 2.49,
      category: 'Milk',
      inStock: 500,
      isActive: true,
    },
    {
      name: 'Buffalo Milk 1L',
      description: 'Creamy buffalo milk, rich taste and high nutrition.',
      images: [],
      price: 2.99,
      category: 'Milk',
      inStock: 300,
      isActive: true,
    },
    {
      name: 'Desi Ghee 500g',
      description: 'Traditional clarified butter made from cow milk.',
      images: [],
      price: 7.99,
      category: 'Ghee',
      inStock: 200,
      isActive: true,
    },
    {
      name: 'Yogurt 500g',
      description: 'Fresh and thick plain yogurt.',
      images: [],
      price: 1.99,
      category: 'Yogurt',
      inStock: 400,
      isActive: true,
    },
    {
      name: 'Paneer 250g',
      description: 'Soft cottage cheese, perfect for cooking.',
      images: [],
      price: 3.49,
      category: 'Cheese',
      inStock: 250,
      isActive: true,
    },
  ];

  await Product.insertMany(items);
  console.log(`Inserted ${items.length} sample products.`);
}

async function main() {
  await connectToDatabase();
  try {
    await seedAdmin();
    await seedProducts();
  } finally {
    await mongoose.connection.close();
  }
}

main()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed', err);
    process.exit(1);
  });


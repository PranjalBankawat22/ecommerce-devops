import 'dotenv/config';
import mongoose from 'mongoose';
import { Product } from './models/product.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-products';

const seedProducts = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio for immersive listening.',
    price: 2999,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/headphones/600/600',
    rating: 4.7,
    reviewCount: 324,
    stock: 18,
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health tracking, GPS, heart rate monitor, and a beautiful AMOLED display. Water-resistant up to 50m.',
    price: 5499,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/smartwatch/600/600',
    rating: 4.5,
    reviewCount: 198,
    stock: 12,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound speaker with deep bass, 20-hour playtime, and IPX7 waterproof rating. Perfect for outdoors.',
    price: 1799,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/speaker/600/600',
    rating: 4.4,
    reviewCount: 256,
    stock: 25,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Compact TKL layout with Cherry MX switches, per-key RGB lighting, and a durable aluminum frame for pro-level performance.',
    price: 3299,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/keyboard/600/600',
    rating: 4.8,
    reviewCount: 411,
    stock: 9,
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Slim 15W fast wireless charger compatible with all Qi-enabled devices. LED indicator and non-slip surface included.',
    price: 899,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/charger/600/600',
    rating: 4.2,
    reviewCount: 142,
    stock: 34,
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless slim-fit denim jacket crafted from 100% premium cotton. Features button closures and two chest pockets.',
    price: 2199,
    category: 'Fashion',
    image: 'https://picsum.photos/seed/denim/600/600',
    rating: 4.6,
    reviewCount: 183,
    stock: 21,
  },
  {
    name: 'Lightweight Running Shoes',
    description: 'Breathable mesh upper with responsive cushioning sole. Engineered for both everyday runs and long-distance training.',
    price: 3499,
    category: 'Fashion',
    image: 'https://picsum.photos/seed/runningshoes/600/600',
    rating: 4.5,
    reviewCount: 302,
    stock: 0,
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Soft, breathable 180gsm cotton tee with a relaxed fit. Pre-shrunk and available in a range of versatile colours.',
    price: 699,
    category: 'Fashion',
    image: 'https://picsum.photos/seed/tshirt/600/600',
    rating: 4.3,
    reviewCount: 521,
    stock: 60,
  },
  {
    name: 'Slim Fit Chino Trousers',
    description: 'Modern slim chinos in a stretch-cotton blend. Smart enough for the office, casual enough for weekends.',
    price: 1899,
    category: 'Fashion',
    image: 'https://picsum.photos/seed/chinos/600/600',
    rating: 4.4,
    reviewCount: 167,
    stock: 14,
  },
  {
    name: 'Full-Grain Leather Wallet',
    description: 'Minimalist bifold wallet hand-stitched from vegetable-tanned full-grain leather. Holds up to 8 cards plus cash.',
    price: 1299,
    category: 'Accessories',
    image: 'https://picsum.photos/seed/wallet/600/600',
    rating: 4.7,
    reviewCount: 389,
    stock: 30,
  },
  {
    name: 'Polarised Aviator Sunglasses',
    description: 'UV400-rated polarised lenses in a classic aviator frame. Includes a hard-shell case and microfibre cleaning cloth.',
    price: 1599,
    category: 'Accessories',
    image: 'https://picsum.photos/seed/sunglasses/600/600',
    rating: 4.6,
    reviewCount: 214,
    stock: 7,
  },
  {
    name: 'Canvas Hiking Backpack',
    description: '35L durable canvas backpack with padded laptop compartment, multiple organiser pockets, and ergonomic shoulder straps.',
    price: 2499,
    category: 'Accessories',
    image: 'https://picsum.photos/seed/backpack/600/600',
    rating: 4.5,
    reviewCount: 276,
    stock: 16,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[seed] Connected to MongoDB');

    const force = process.argv.includes('--force');
    if (!force) {
      const count = await Product.countDocuments();
      if (count > 0) {
        console.log(`[seed] Database already has ${count} products. Run with --force to reseed.`);
        await mongoose.disconnect();
        process.exit(0);
      }
    } else {
      await Product.deleteMany({});
      console.log('[seed] Cleared existing products');
    }

    await Product.insertMany(seedProducts);
    console.log(`[seed] Inserted ${seedProducts.length} products`);

    await mongoose.disconnect();
    console.log('[seed] Done');
    process.exit(0);
  } catch (error) {
    console.error('[seed] Failed:', error);
    process.exit(1);
  }
}

seed();

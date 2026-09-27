import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-products';

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('connected', () => {
    console.log('[db] Connected to MongoDB');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('[db] Disconnected from MongoDB');
  });

  await mongoose.connect(MONGODB_URI);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

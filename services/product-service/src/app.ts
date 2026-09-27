import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import productRoutes from './routes/product.routes';
import { errorHandler } from './middleware/error-handler';

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[req] ${req.method} ${req.path}`);
  next();
});

app.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState !== 1) {
    res.status(503).json({ status: 'error', message: 'Database unavailable' });
    return;
  }
  res.json({ status: 'ok' });
});

app.use('/api/products', productRoutes);

app.use(errorHandler);

export default app;

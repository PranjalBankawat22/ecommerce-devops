import express from 'express';
import cors from 'cors';
import cartRoutes from './routes/cart.routes';
import { errorHandler } from './middleware/error-handler';
import { redis } from './config/redis';

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[req] ${req.method} ${req.path}`);
  next();
});

app.get('/health', async (_req, res) => {
  try {
    await redis.ping();
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'error', message: 'Redis unavailable' });
  }
});

app.use('/api/cart', cartRoutes);

app.use(errorHandler);

export default app;

import 'dotenv/config';
import app from './app';
import { redis } from './config/redis';

const PORT = parseInt(process.env.PORT || '4002', 10);

async function start() {
  try {
    await redis.ping();
    console.log('[server] Redis connection verified');

    app.listen(PORT, () => {
      console.log(`[server] Cart Service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[server] Failed to start:', error);
    process.exit(1);
  }
}

start();

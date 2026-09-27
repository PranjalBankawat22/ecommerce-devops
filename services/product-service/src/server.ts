import 'dotenv/config';
import app from './app';
import { connectDatabase } from './config/database';

const PORT = parseInt(process.env.PORT || '4001', 10);

async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`[server] Product Service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[server] Failed to start:', error);
    process.exit(1);
  }
}

start();

import 'dotenv/config';
import app from './app.js';
import db from './config/db.js';

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await db.connect();
  } catch (error) {
    console.warn('Database startup check failed, but the API will continue in dev mode.');
  }

  app.listen(PORT, () => {
    console.log(`TaskFlow Pro API is running on port ${PORT}`);
  });
}

startServer();

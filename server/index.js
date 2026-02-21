import { validateEnv } from './config/env.js';
import app from './app.js';

// Validate environment on startup
validateEnv();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🍽️  PawangDahar Server Started       ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`🚀 Running at: http://${HOST}:${PORT}`);
  console.log(`📍 Health check: http://${HOST}:${PORT}/api/health`);
  console.log(`📁 Upload dir: ./uploads`);
  console.log('');
});

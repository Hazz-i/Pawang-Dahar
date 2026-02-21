import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const validateEnv = () => {
  const required = ['GOOGLE_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('📝 Please set these in server/.env file');
    process.exit(1);
  }

  if (process.env.GOOGLE_API_KEY === 'your_api_key_here' || 
      process.env.GOOGLE_API_KEY === '' ||
      !process.env.GOOGLE_API_KEY.startsWith('AIza')) {
    console.error('❌ Invalid GOOGLE_API_KEY in server/.env');
    console.error('📝 Get valid API key from: https://ai.google.dev/aistudio');
    console.error('⚠️  API key should start with "AIza"');
    console.error('📄 See GEMINI_API_SETUP.md for instructions');
    process.exit(1);
  }

  return true;
};

export { validateEnv };

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { upload } from './config/multer.js';
import foodRoutes from './routes/foodRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import geminiRoutes from './routes/geminiRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve uploaded files
app.use('/api/chat/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/food/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
	res.json({ status: 'OK', message: 'PawangDahar API is running!' });
});

app.use('/api/food', foodRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gemini', geminiRoutes);

app.use((err, req, res, next) => {
	console.error('Error:', err);
	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal Server Error',
	});
});

export default app;

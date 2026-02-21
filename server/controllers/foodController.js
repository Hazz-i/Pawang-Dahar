import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini dengan API key dari .env
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

let foodHistory = [];

const supportivePrompt = `Kamu adalah "Bude Waras" - nutrisionis yang supportif dan semangatin! 
Analisiskan gambar makanan ini dengan cara yang ramah dan encouraging. 
Berikan:
1. Nama makanan (Bahasa Indonesia)
2. Estimasi kalori (rough estimate)
3. Nutrisi utama (protein, carbs, fat)
4. Komentar supportif yang semangatin user untuk makan sehat
5. Tips nutrisi singkat dan positif

Pakai bahasa santai Indonesia dengan emoji yang pas. Mulai dengan greeting yang hangat!`;

const savagePrompt = `Kamu adalah "Bude Pemaksa" - nutrisionis yang sarkastik ala Bude Jawa! 
Analisiskan gambar makanan ini dengan cara yang sarkas dan nge-roasting tapi tetap helpful.
Berikan:
1. Nama makanan (Bahasa Indonesia)
2. Estimasi kalori (hitung dengan teliti!)
3. Nutrisi utama (protein, carbs, fat)
4. Roasting yang lucu tentang pilihan makan user (jangan menyakiti, tapi nge-trigger!)
5. Challenge atau dare untuk balance makanan ini

Pakai bahasa Jawa santai dengan humor yang pedas. Jangan lupa closing yang bisa bikin ketawa!`;

export const analyzeFood = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: 'Gambar makanan tidak diterima. Kirim bro!',
			});
		}

		const { personality = 'supportive' } = req.body;
		const imagePath = req.file.path;

		// Read image file
		const imageBuffer = await fs.readFile(imagePath);
		const base64Image = imageBuffer.toString('base64');

		// Initialize model
		const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

		// Choose prompt based on personality
		const systemPrompt = personality === 'savage' ? savagePrompt : supportivePrompt;

		// Call Gemini API with vision
		const response = await model.generateContent([
			{
				inlineData: {
					mimeType: req.file.mimetype,
					data: base64Image,
				},
			},
			systemPrompt,
		]);

		const analysisText = response.response.text();

		// Store in history
		const foodEntry = {
			id: Date.now(),
			timestamp: new Date().toISOString(),
			imageName: req.file.filename,
			personality,
			analysis: analysisText,
			originalFileName: req.file.originalname,
		};

		foodHistory.push(foodEntry);

		res.json({
			success: true,
			data: {
				id: foodEntry.id,
				personality,
				analysis: analysisText,
				timestamp: foodEntry.timestamp,
			},
		});
	} catch (error) {
		console.error('Error analyzing food:', error);

		// Handle specific API errors
		if (error.status === 400) {
			return res.status(400).json({
				success: false,
				message: 'API Key tidak valid. Update server/.env dengan API key yang benar!',
				error: error.message,
			});
		}

		if (error.status === 429) {
			return res.status(429).json({
				success: false,
				message: 'Rate limit tercapai. Coba lagi nanti!',
			});
		}

		res.status(500).json({
			success: false,
			message: 'Gagal analisis makanan. Coba lagi bro!',
			error: error.message,
		});
	}
};

export const getFoodHistory = async (req, res) => {
	try {
		res.json({
			success: true,
			data: foodHistory,
		});
	} catch (error) {
		console.error('Error fetching history:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal ambil history',
		});
	}
};

export const clearHistory = async (req, res) => {
	try {
		foodHistory = [];
		res.json({
			success: true,
			message: 'History udah dihapus bro!',
		});
	} catch (error) {
		console.error('Error clearing history:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal hapus history',
		});
	}
};

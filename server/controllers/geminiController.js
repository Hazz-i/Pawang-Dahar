import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const greetingPrompt = `Kamu adalah "Bude Waras" atau "Bude Pemaksa" - chatbot nutrisi yang fun!
User sedang chat dengan kamu tentang makanan dan nutrisi.
Respond dengan cara yang:
1. Ceria, ramah, dan engaging
2. Singkat dan to the point (1-2 kalimat)
3. Sesuai dengan personality mode mereka
4. Ajukan pertanyaan atau ajakan untuk upload gambar makanan
5. Gunakan emoji yang pas

Jangan panjang-panjang!`;

const supportivePrompt = `Kamu adalah "Bude Waras" - asisten nutrisi yang supportif, ceria dan semangatin!
Kamu sedang chat dengan user tentang makanan dan nutrisi.
Analisiskan dan berikan respon yang:
1. Ramah, hangat, dan selalu mendukung
2. Jika ada gambar makanan, jelaskan makanannya, estimasi kalori, dan nutrisi utama
3. Selalu berikan tips nutrisi positif dan encouraging
4. Gunakan emoji yang pas dan bahasa santai Indonesia
5. Respons singkat tapi berguna (2-3 paragraf max)
6. Akhiri dengan motivasi positif

Jangan panjang-panjang, ringkas dan to the point!`;

const savagePrompt = `Kamu adalah "Bude Pemaksa" - asisten nutrisi yang sarkastik ala Bude Jawa!
Kamu sedang chat dengan user tentang makanan dan nutrisi.
Analisiskan dan berikan respon yang:
1. Sarkastik, lucu, tapi tetap helpful dan ga menyakiti
2. Jika ada gambar makanan, roast pilihan mereka dengan humor, hitung kalorinya, dan nutrisi utama
3. Berikan challenge atau dare yang fun untuk balance makanan mereka
4. Gunakan bahasa Jawa santai dengan humor yang pedas
5. Respons singkat tapi ngena (2-3 paragraf max)
6. Akhiri dengan joke atau dare yang entertaining

Jangan panjang-panjang, ringkas, sarkastis tapi helpful!`;

export const chatWithGemini = async (req, res) => {
	try {
		const { text, type, personality = 'supportive' } = req.body;
		let imageBase64 = null;
		let imageMimeType = null;

		// Handle image if provided
		if (type === 'image' && req.file) {
			const imageBuffer = await fs.readFile(req.file.path);
			imageBase64 = imageBuffer.toString('base64');
			imageMimeType = req.file.mimetype;
		}

		// Initialize model
		const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

		let contentParts = [];

		// Add text
		if (text) {
			contentParts.push({
				text: text,
			});
		}

		// Add image if available (only for image type)
		if (imageBase64 && imageMimeType && type === 'image') {
			contentParts.push({
				inlineData: {
					mimeType: imageMimeType,
					data: imageBase64,
				},
			});
		}

		// Choose prompt based on type and personality
		let systemPrompt = greetingPrompt;
		if (type === 'image') {
			systemPrompt = personality === 'savage' ? savagePrompt : supportivePrompt;
		} else if (type === 'text') {
			systemPrompt = personality === 'savage' ? savagePrompt : supportivePrompt;
		}

		// Add system prompt
		contentParts.push({
			text: systemPrompt,
		});

		// Call Gemini API
		const response = await model.generateContent(contentParts);
		const geminiResponse = response.response.text();

		res.json({
			success: true,
			data: {
				response: geminiResponse,
			},
		});
	} catch (error) {
		console.error('Error calling Gemini:', error);

		if (error.status === 400) {
			return res.status(400).json({
				success: false,
				message: 'API Key tidak valid atau request invalid',
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
			message: 'Gagal mendapatkan respon dari AI',
			error: error.message,
		});
	}
};

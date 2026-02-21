import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let chatMessages = [];

export const sendMessage = async (req, res) => {
	try {
		const { text, sender = 'user' } = req.body;
		let imageFileName = null;

		// Handle image upload if provided
		if (req.file) {
			imageFileName = req.file.filename;
		}

		// Validate at least one content type exists
		if (!text && !imageFileName) {
			return res.status(400).json({
				success: false,
				message: 'Kirim pesan teks atau gambar minimal 1!',
			});
		}

		const message = {
			id: Date.now(),
			text: text || null,
			imageName: imageFileName,
			sender,
			timestamp: new Date().toISOString(),
			imageUrl: imageFileName ? `/api/chat/uploads/${imageFileName}` : null,
		};

		chatMessages.push(message);

		res.json({
			success: true,
			data: message,
		});
	} catch (error) {
		console.error('Error sending message:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal kirim pesan',
		});
	}
};

export const getMessages = async (req, res) => {
	try {
		res.json({
			success: true,
			data: chatMessages,
		});
	} catch (error) {
		console.error('Error fetching messages:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal ambil pesan',
		});
	}
};

export const clearChat = async (req, res) => {
	try {
		chatMessages = [];
		res.json({
			success: true,
			message: 'Chat cleared!',
		});
	} catch (error) {
		console.error('Error clearing chat:', error);
		res.status(500).json({
			success: false,
			message: 'Gagal clear chat',
		});
	}
};

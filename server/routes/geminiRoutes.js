import express from 'express';
import { upload } from '../config/multer.js';
import { chatWithGemini } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/chat', upload.single('image'), chatWithGemini);

export default router;

import express from 'express';
import { upload } from '../config/multer.js';
import { sendMessage, getMessages, clearChat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/send', upload.single('image'), sendMessage);
router.get('/messages', getMessages);
router.delete('/clear', clearChat);

export default router;

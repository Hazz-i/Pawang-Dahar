import express from 'express';
import { upload } from '../config/multer.js';
import { analyzeFood, getFoodHistory, clearHistory } from '../controllers/foodController.js';

const router = express.Router();

router.post('/analyze', upload.single('foodImage'), analyzeFood);
router.get('/history', getFoodHistory);
router.delete('/history', clearHistory);

export default router;

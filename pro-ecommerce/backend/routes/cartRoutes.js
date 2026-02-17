import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserCart, addToCart } from '../controllers/cartController.js';

const router = express.Router();

router.route('/')
    .get(protect, getUserCart)
    .post(protect, addToCart);

export default router;
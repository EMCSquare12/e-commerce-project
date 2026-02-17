import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserCart, updateUserCart, mergeCart } from '../controllers/cartController.js';

const router = express.Router();

router.route('/')
    .get(protect, getUserCart)
    .post(protect, updateUserCart);

router.route('/merge').post(protect, mergeCart);

export default router;
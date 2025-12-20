import express from 'express';
const router = express.Router();
import { addOrderItems, getOrdersAdmin } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
router.get('/admin', getOrdersAdmin)

export default router;
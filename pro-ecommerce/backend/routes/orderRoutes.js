import express from 'express';
const router = express.Router();
import { addOrderItems, getOrdersAdmin, updateOrderToDelivered } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
router.route('/admin').get(protect, getOrdersAdmin)
router.put("/:id", protect, admin, updateOrderToDelivered)


export default router;
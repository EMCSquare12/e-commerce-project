import express from 'express';
const router = express.Router();
import {
    getProducts,
    getProductById,
    deleteProduct,
    getCategories
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/categories', getCategories);

// Route for /api/products
router.route('/').get(getProducts);
// Route for /api/products/:id
router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct); // <--- This is the new delete route

export default router;
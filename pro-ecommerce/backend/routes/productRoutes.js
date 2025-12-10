import express from 'express';
const router = express.Router();
import {
    getProducts,
    getProductById,
    deleteProduct,
    getCategories,
    getBrands
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/categories', getCategories);
router.get('/brands', getBrands)

// Route for /api/products
router.route('/').get(getProducts);
// Route for /api/products/:id
router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct); // <--- This is the new delete route

export default router;
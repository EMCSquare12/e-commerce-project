import express from 'express';
const router = express.Router();
import {
    getProducts,
    getProductById,
    deleteProduct,
    getCategories,
    getBrands,
    getProductsAdmin,
    getStockStatus,
    updateProduct,
    createProduct,
    getProductNavigation,
    submitReview,
    getProductOrderHistory
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/categories', protect, getCategories);
router.get('/brands', protect, getBrands)
router.get('/status', protect, getStockStatus)

router
    .route('/').get(protect, getProducts)
    .post(protect, admin, createProduct)

router.get('/admin', protect, admin, getProductsAdmin);
router.get('/admin/:id/navigation', protect, admin, getProductNavigation)
router.get('/:id/navigation', protect, getProductNavigation)
router.post('/:id/reviews', protect, submitReview);
router.get('/admin/products/:id', protect, getProductOrderHistory);

router
    .route('/:id')
    .get(protect, getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct)


export default router;
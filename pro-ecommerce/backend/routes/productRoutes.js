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
    createProduct

} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.get('/categories', getCategories);
router.get('/brands', getBrands)
router.get('/status', getStockStatus)

router.route('/').get(getProducts);

router.get('/admin', getProductsAdmin);
// Route for /api/products/:id
router
    .route('/:id')
    .get(getProductById)
    .delete(deleteProduct)
    .put(updateProduct)
    .post(createProduct)


export default router;
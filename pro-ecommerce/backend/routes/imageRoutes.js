import express from 'express';
import { upload, uploadImage } from '../controllers/imageController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), uploadImage);
export default router;
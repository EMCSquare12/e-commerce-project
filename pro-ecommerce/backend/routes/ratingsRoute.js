import express from "express";
import {
    getReviewsByProduct,
    addReview,
} from "../controllers/ratingsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/:id").get(getReviewsByProduct).post(protect, addReview);

export default router;
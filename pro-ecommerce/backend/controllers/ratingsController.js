import asyncHandler from 'express-async-handler';
import Ratings from '../models/RatingsModel.js';
import mongoose from 'mongoose';

const getReviewsByProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
    const reviews = await Ratings.find({ productId }).populate('user', 'name email');
    res.json(reviews);
});

const addReview = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
    const newReview = new Ratings({
        productId,
        rating,
        review,
        user: userId
    });
    await newReview.save();
    res.status(201).json(newReview);
});

export { getReviewsByProduct, addReview };
import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (cart) {
        const formattedItems = cart.cartItems.map((item) => {
            // Filter out null products (in case product was deleted from DB)
            if (!item.product) return null;
            return {
                ...item.product.toObject(),
                _id: item.product._id,
                qty: item.qty,
            };
        }).filter(item => item !== null);

        res.json(formattedItems);
    } else {
        res.json([]);
    }
});

// @desc    Sync user cart (Overwrite DB with Frontend State)
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;

    // Validation
    if (!cartItems || !Array.isArray(cartItems)) {
        res.status(400);
        throw new Error('Invalid cart data');
    }

    const dbCartItems = cartItems.map((item) => ({
        product: item._id,
        qty: item.qty,
    }));

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems = dbCartItems;
    } else {
        // Create new cart
        cart = new Cart({
            user: req.user._id,
            cartItems: dbCartItems,
        });
    }

    await cart.save();

    await cart.populate('cartItems.product');

    const formattedItems = cart.cartItems.map((item) => {
        if (!item.product) return null;
        return {
            ...item.product.toObject(),
            _id: item.product._id,
            qty: item.qty,
        };
    }).filter(item => item !== null);

    res.json(formattedItems);
});

export { getUserCart, addToCart };
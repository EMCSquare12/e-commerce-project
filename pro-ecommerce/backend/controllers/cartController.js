import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (cart) {
        const formattedItems = cart.cartItems.map(item => {
            // Safety check in case a product was deleted from DB but exists in cart
            if (!item.product) return null;

            return {
                ...item.product.toObject(),
                _id: item.product._id,
                qty: item.qty
            };
        }).filter(item => item !== null);

        res.json(formattedItems);
    } else {
        res.json([]);
    }
});

// @desc    Update/Sync user cart
// @route   POST /api/cart
// @access  Private
const syncCart = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;

    const dbCartItems = cartItems.map(item => ({
        product: item._id,
        qty: item.qty
    }));

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        // Update existing cart
        cart.cartItems = dbCartItems;
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } else {
        // Create new cart
        const newCart = await Cart.create({
            user: req.user._id,
            cartItems: dbCartItems,
        });
        res.json(newCart);
    }
});

export { getUserCart, syncCart };
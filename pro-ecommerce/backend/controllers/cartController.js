import asyncHandler from '../middleware/asyncHandler.js';
import Cart from '../models/cartModel.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (cart) {
        res.json(cart.cartItems);
    } else {
        res.json([]);
    }
});

// @desc    Update/Sync user cart
// @route   POST /api/cart
// @access  Private
const syncCart = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        // If cart exists, update it
        cart.cartItems = cartItems;
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } else {
        // If no cart exists, create one
        const newCart = await Cart.create({
            user: req.user._id,
            cartItems: cartItems,
        });
        res.json(newCart);
    }
});

export { getUserCart, syncCart };
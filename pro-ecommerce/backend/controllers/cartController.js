import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (cart) {
        const formattedItems = cart.cartItems.map(item => {
            if (!item.product) return null; // Safety check

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
const addToCart = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
        res.status(400);
        throw new Error('Invalid cart data');
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cartItems.forEach((newItem) => {
            const existingItem = cart.cartItems.find(
                (item) => item.product.toString() === newItem._id
            );

            if (existingItem) {
                existingItem.qty = newItem.qty;
            } else {
                cart.cartItems.push({
                    product: newItem._id,
                    qty: newItem.qty
                });
            }
        });

        await cart.save();
    } else {
        const dbCartItems = cartItems.map(item => ({
            product: item._id,
            qty: item.qty
        }));

        await Cart.create({
            user: req.user._id,
            cartItems: dbCartItems,
        });
    }

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    const formattedResponse = updatedCart.cartItems.map(item => {
        if (!item.product) return null;
        return {
            ...item.product.toObject(),
            _id: item.product._id,
            qty: item.qty
        };
    }).filter(item => item !== null);

    res.json(formattedResponse);
});

export { getUserCart, addToCart };
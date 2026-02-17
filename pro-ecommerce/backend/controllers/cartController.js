import asyncHandler from 'express-async-handler';
import Cart from '../models/cartModel.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (cart) {
        const formattedItems = cart.cartItems.map((item) => {
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
const updateUserCart = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;

    const dbCartItems = cartItems.map((item) => ({
        product: item._id,
        qty: item.qty,
    }));

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.cartItems = dbCartItems;
    } else {
        cart = new Cart({
            user: req.user._id,
            cartItems: dbCartItems,
        });
    }

    await cart.save();
    res.json(cartItems);
});

// @desc    Merge Local Storage Cart with DB Cart on Login
// @route   POST /api/cart/merge
// @access  Private
const mergeCart = asyncHandler(async (req, res) => {
    const { cartItems: localItems } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        // If no DB cart exists, create one with local items
        const dbCartItems = localItems.map((item) => ({
            product: item._id,
            qty: item.qty,
        }));
        cart = new Cart({
            user: req.user._id,
            cartItems: dbCartItems
        });
    } else {
        // If DB cart exists, merge logic
        localItems.forEach((localItem) => {
            const existingItem = cart.cartItems.find(
                (dbItem) => dbItem.product.toString() === localItem._id
            );

            if (existingItem) {
                // Product exists in DB, add quantity
                existingItem.qty += localItem.qty;
            } else {
                // Product not in DB, push it
                cart.cartItems.push({
                    product: localItem._id,
                    qty: localItem.qty
                });
            }
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

export { getUserCart, updateUserCart, mergeCart };
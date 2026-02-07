import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from "../models/productModel.js"
import Notifications from '../models/notificationsModel.js';
import mongoose from 'mongoose';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        // Update Stock
        const updateStockPromises = createdOrder.orderItems.map((item) => {
            return Product.findByIdAndUpdate(
                item.product,
                { $inc: { countInStock: -item.qty } },
                { new: true }
            );
        });

        const updatedProducts = await Promise.all(updateStockPromises);

        if (updatedProducts.includes(null)) {
            await Order.findByIdAndDelete(createdOrder._id);
            res.status(400);
            throw new Error('One or more items are no longer available');
        }

        // Notify Clients via Socket.io
        req.io.emit('stockUpdated', updatedProducts.map(p => ({
            _id: p._id,
            countInStock: p.countInStock,
            status: p.status
        })));

        // Update User stats
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { totalSpent: totalPrice },
            $push: { orders: createdOrder }
        });

        // Notifications Logic
        const admins = await User.find({ isAdmin: true });
        if (admins.length > 0) {
            const orderNotifications = admins.map(admin => ({
                recipient: admin._id,
                user: req.user.name,
                type: "order",
                title: "New Order Placed",
                message: `Order #${createdOrder.orderId} placed by ${req.user.name}`,
                relatedId: createdOrder._id
            }));

            await Notifications.insertMany(orderNotifications);

            // Low Stock Alerts
            const lowStockItems = updatedProducts.filter(p => p && p.countInStock < 10);
            if (lowStockItems.length > 0) {
                const stockNotifications = [];
                admins.forEach(admin => {
                    lowStockItems.forEach(product => {
                        stockNotifications.push({
                            recipient: admin._id,
                            user: "System",
                            type: "alert",
                            title: product.countInStock === 0 ? "Out of Stock!" : "Low Stock Alert",
                            message: `Item "${product.name}" is down to ${product.countInStock} units.`,
                            relatedId: product._id
                        });
                    });
                });
                if (stockNotifications.length > 0) {
                    await Notifications.insertMany(stockNotifications);
                }
            }
            req.io.emit('newOrderPlaced');
        }

        res.status(201).json(createdOrder);
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 })
    res.json(orders)
})

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        // Emit event to update frontend in real-time
        if (req.io) req.io.emit('orderStatusUpdated', updatedOrder);

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const buildFilter = async (query) => {
    const { keyword, status, from, to, userId } = query;
    const filter = {};

    if (keyword && keyword.trim() !== '') {
        const cleanKeyword = keyword.trim();
        const safeKeyword = escapeRegExp(cleanKeyword);
        const keywordRegex = { $regex: safeKeyword, $options: 'i' };

        const orConditions = [
            { 'orderItems.name': keywordRegex },
            { 'shippingAddress.address': keywordRegex },
            { 'shippingAddress.city': keywordRegex },
            { 'shippingAddress.postalCode': keywordRegex },
            { 'shippingAddress.country': keywordRegex },
        ];

        if (!isNaN(cleanKeyword)) {
            orConditions.push({ orderId: Number(cleanKeyword) });
        }

        if (mongoose.Types.ObjectId.isValid(cleanKeyword)) {
            orConditions.push({ _id: cleanKeyword });
        }

        const matchingUsers = await User.find({
            $or: [
                { name: keywordRegex },
                { email: keywordRegex }
            ]
        }).select('_id');

        if (matchingUsers.length > 0) {
            orConditions.push({ user: { $in: matchingUsers.map(u => u._id) } });
        }

        filter.$or = orConditions;
    }

    if (userId) filter.user = userId;

    if (status) {
        if (status === "Shipped") filter.isDelivered = true;
        else if (status === "Pending") filter.isDelivered = false;
    }

    if (from || to) {
        filter.createdAt = {};
        if (from) {
            const startDate = new Date(from);
            startDate.setHours(0, 0, 0, 0);
            filter.createdAt.$gte = startDate;
        }
        if (to) {
            const endDate = new Date(to);
            endDate.setHours(23, 59, 59, 999);
            filter.createdAt.$lte = endDate;
        }
    }

    console.log("Generated Filter:", JSON.stringify(filter, null, 2));

    return filter;
};

const getOrdersAdmin = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const filter = await buildFilter(req.query);

    const count = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
        .populate('user', 'name email')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
});

export {
    addOrderItems,
    getOrder,
    getOrdersAdmin,
    updateOrderToDelivered
};
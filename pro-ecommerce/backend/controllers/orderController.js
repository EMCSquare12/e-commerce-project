import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from "../models/productModel.js"
import Notifications from '../models/notificationsModel.js';


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

        const updateStockPromises = createdOrder.orderItems.map((item) => {
            return Product.findByIdAndUpdate(
                item.product,
                { $inc: { countInStock: -item.qty } },
                { new: true }
            );
        });

        const updatedProducts = await Promise.all(updateStockPromises);

        req.io.emit('stockUpdated', updatedProducts.map(p => ({
            _id: p._id,
            countInStock: p.countInStock,
            status: p.status
        })));

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { totalSpent: totalPrice }, $push: { orders: createdOrder }
        });

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

            const lowStockItems = updatedProducts.filter(p => p.countInStock < 10);

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

const updateStockPromises = createdOrder.orderItems.map((item) => {
    return Product.findOneAndUpdate(
        {
            _id: item.product,
            countInStock: { $gte: item.qty }
        },
        { $inc: { countInStock: -item.qty } },
        { new: true }
    );
});

const updatedProducts = await Promise.all(updateStockPromises);

if (updatedProducts.includes(null)) {

    await Order.findByIdAndDelete(createdOrder._id);
    res.status(400);
    throw new Error('One or more items are no longer available in the requested quantity');
}

const getOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 })
    res.json(orders)
})

const buildFilter = async (query) => {
    const { keyword, status, from, to, userId } = query;
    const filter = {};

    if (keyword) {
        const keywordRegex = { $regex: keyword, $options: 'i' };

        // Array to hold all OR conditions
        const orConditions = [
            // Search Item Names
            { 'orderItems.name': keywordRegex },
            // Search Address Fields
            { 'shippingAddress.address': keywordRegex },
            { 'shippingAddress.city': keywordRegex },
            { 'shippingAddress.postalCode': keywordRegex },
            { 'shippingAddress.country': keywordRegex },
        ];

        // Search Order ID (only if keyword is a valid number)
        if (!isNaN(keyword) && keyword.trim() !== '') {
            orConditions.push({ orderId: Number(keyword) });
        }
        const matchingUsers = await User.find({ name: keywordRegex }).select('_id');
        if (matchingUsers.length > 0) {
            orConditions.push({ user: { $in: matchingUsers.map(u => u._id) } });
        }

        filter.$or = orConditions;
    }

    if (userId) {
        filter.user = userId
    }

    if (status) {
        if (status === "Shipped") {
            filter.isDelivered = true;
        } else if (status === "Pending") {
            filter.isDelivered = false;
        }
    }

    if (from || to) {
        filter.createdAt = {}

        if (from) {
            const startDate = new Date(from)
            startDate.setHours(0, 0, 0, 0)
            filter.createdAt.$gte = startDate
        }
        if (to) {
            const endDate = new Date(to)
            endDate.setHours(23, 59, 59, 999)
            filter.createdAt.$lte = endDate
        }
    }

    return filter;
};

const getOrdersAdmin = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    // Await the async buildFilter function
    const filter = await buildFilter(req.query);

    const count = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
        .populate('user', 'name')
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
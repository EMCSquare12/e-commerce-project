import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';


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

        await User.findByIdAndUpdate(req.user._id, {
            $inc: { totalSpent: totalPrice },
        });

        const admins = await User.find({ isAdmin: true });

        if (admins.length > 0) {
            const notifications = admins.map(admin => ({
                recipient: admin._id,
                type: "order",
                title: "New Order Placed",
                message: `Order #${createdOrder._id} placed by ${req.user.name}`,
                link: `/admin/order/${createdOrder._id}`,
                relatedId: createdOrder._id
            }));

            await Notification.insertMany(notifications);
        }

        res.status(201).json(createdOrder);
    }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()
        const updatedOrder = await order.save()

        await Notifications.create({
            recipient: order.user,
            type: "order",
            title: "Order Deliverd",
            message: "Your package has arrived! Enjoy your purchase.",
            link: `/order/${order._id}`,
            relatedId: order._id
        })
        res.json(updatedOrder)
    } else {
        res.status(404)
        throw new Error("Order not found")
    }
})

const getOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 })
    res.json(orders)
})

const buildFilter = (query) => {
    const { keyword, status, from, to } = query;
    const filter = {};

    if (keyword) {
        filter.name = { $regex: keyword, $options: 'i' };
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
    const pageSize = 10
    const page = Number(req.query.pageNumber)

    const filter = buildFilter(req.query)

    const count = await Order.countDocuments(filter)
    const orders = await Order.find(filter)
        .populate('user', 'name')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 })

    res.json({ orders, page, pages: Math.ceil(count / pageSize) })
})
export { addOrderItems, getOrder, getOrdersAdmin };
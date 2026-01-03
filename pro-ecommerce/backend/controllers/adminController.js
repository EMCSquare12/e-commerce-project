import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

// @desc    Get Dashboard Stats (Total Sales, Revenue, Daily Data)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const today = new Date();
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));

    const ordersCount = await Order.countDocuments({
        createdAt: { $gte: startOfDay }
    });
    const usersCount = await User.countDocuments({
        createdAt: { $gte: startOfDay }
    });

    const totalRevenueData = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailySales = await Order.aggregate([
        {
            $match: { createdAt: { $gte: sevenDaysAgo } }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                sales: { $sum: '$totalPrice' },
            },
        },
        { $sort: { _id: 1 } }
    ]);

    const dailyOrders = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfDay }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $project: {
                orderId: 1,
                status: 1,
                totalPrice: 1,
                createdAt: {
                    $dateToString: {
                        format: "%m-%d-%Y",
                        date: "$createdAt"
                    }
                },
                shippingAddress: 1,
                "user.name": "$userDetails.name",
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: pageSize * (page - 1) },
        { $limit: pageSize }
    ])

    res.json({
        usersCount,
        ordersCount,
        totalRevenue,
        dailySales,
        dailyOrders,
        page,
        pages: Math.ceil(ordersCount / pageSize)
    });
});

export { getDashboardStats };
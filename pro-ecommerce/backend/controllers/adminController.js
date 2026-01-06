import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

// @desc    Get Dashboard Data (Stats, Charts, and Recent Orders)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboard = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orderFilter = {
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    };

    if (req.query.keyword) {
        orderFilter.name = { $regex: req.query.keyword, $options: 'i' };
    }

    const [
        ordersCountToday,
        usersCountToday,
        totalRevenueData,
        dailySales,
        ordersData
    ] = await Promise.all([
        Order.countDocuments(orderFilter),

        User.countDocuments(orderFilter || {}),

        Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),

        Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    sales: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } }
        ]),

        Order.find(orderFilter)
            .populate('user', 'name')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 })
    ]);

    res.json({
        stats: {
            usersCountToday,
            ordersCountToday,
            totalRevenue: totalRevenueData[0]?.total || 0,
        },
        charts: {
            dailySales,
        },
        orders: {
            data: ordersData,
            page,
            pages: Math.ceil(ordersCountToday / pageSize),
        }
    });
});

export { getDashboard };
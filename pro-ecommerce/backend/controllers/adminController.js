import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Get Dashboard Stats (Total Sales, Revenue, Daily Data)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Basic Counts
    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    // 2. Total Revenue (Sum of all orders)
    const totalRevenueData = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    // 3. Sales Graph Data (Group by Date)
    // This powers the "Wave Chart" in your Dashboard design
    const dailySales = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                sales: { $sum: '$totalPrice' },
            },
        },
        { $sort: { _id: 1 } }, // Sort Oldest to Newest
        { $limit: 7 }, // Last 7 days (or remove limit for full month)
    ]);

    res.json({
        usersCount,
        ordersCount,
        totalRevenue,
        dailySales,
    });
});

export { getDashboardStats };
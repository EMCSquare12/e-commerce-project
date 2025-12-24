import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

// @desc    Get Dashboard Stats (Total Sales, Revenue, Daily Data)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Basic Counts
    const today = new Date()
    const ordersCount = await Order.countDocuments({
        createdAt: { $gte: today.setHours(0, 0, 0, 0) }
    });
    const usersCount = await User.countDocuments({
        createdAt: { $gte: today.setHours(0, 0, 0, 0) }
    });

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



    const dailyOrders = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: today }
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
        }
    ]);
    res.json({
        usersCount,
        ordersCount,
        totalRevenue,
        dailySales,
        dailyOrders
    });
});

export { getDashboardStats };
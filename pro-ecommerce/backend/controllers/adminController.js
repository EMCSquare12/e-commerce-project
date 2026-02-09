import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import escapeRegExp from '../utils/utils.js';


// @desc    Get Dashboard Data (Stats, Charts, and Recent Orders)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboard = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const todayDateFilter = {
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    };

    // Start with the date filter, then add search conditions if keyword exists
    let orderListFilter = { ...todayDateFilter };

    if (keyword && keyword.trim() !== '') {
        const cleanKeyword = keyword.trim();
        const safeKeyword = escapeRegExp(cleanKeyword);
        const keywordRegex = { $regex: safeKeyword, $options: 'i' };

        const orConditions = [
            // Search Item Names
            { 'orderItems.name': keywordRegex },
            // Search Address Fields
            { 'shippingAddress.address': keywordRegex },
            { 'shippingAddress.city': keywordRegex },
            { 'shippingAddress.postalCode': keywordRegex },
            { 'shippingAddress.country': keywordRegex },
        ];

        // Search Order ID (only if numeric)
        if (!isNaN(cleanKeyword)) {
            orConditions.push({ orderId: Number(cleanKeyword) });
        }

        // Search Customer (Name OR Email)
        const matchingUsers = await User.find({
            $or: [
                { name: keywordRegex },
                { email: keywordRegex }
            ]
        }).select('_id');

        if (matchingUsers.length > 0) {
            orConditions.push({ user: { $in: matchingUsers.map(u => u._id) } });
        }

        // Combine logic: (Date Range) AND (Search Conditions)
        orderListFilter.$or = orConditions;
    }

    const [
        ordersCountToday,
        filteredOrdersCount,
        usersCountToday,
        totalRevenueData,
        dailySales,
        ordersData
    ] = await Promise.all([
        // A. Total Orders Today (Unfiltered Stat)
        Order.countDocuments(todayDateFilter),

        // B. Filtered Orders Count (For Pagination)
        Order.countDocuments(orderListFilter),

        // C. Count New Users Today (Date Only)
        User.countDocuments(todayDateFilter),

        // D. Calculate Revenue TODAY (Date Only)
        Order.aggregate([
            { $match: todayDateFilter },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),

        // E. Chart Data (Last 7 Days)
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

        // F. Recent Orders List (Filtered by Search + Day)
        Order.find(orderListFilter)
            .populate('user', 'name email')
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
            pages: Math.ceil(filteredOrdersCount / pageSize),
        }
    });
});

export { getDashboard };
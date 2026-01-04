import asyncHandler from 'express-async-handler';
import Notifications from "../models/notificationsModel.js";
import Order from '../models/orderModel.js';

// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notifications.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .lean();

    res.json(notifications);
});

// @desc    Get notification details and related data
// @route   GET /api/notifications/:id
// @access  Private
const getNotificationDetails = asyncHandler(async (req, res) => {
    const notification = await Notifications.findById(req.params.id);
    let relatedData = null;

    if (!notification) {
        res.status(404);
        throw new Error("Notification not found");
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("Not Authorized to view this notification");
    }

    if (notification.type === "order" && notification.relatedId) {
        relatedData = await Order.findById(notification.relatedId)
            .select("totalPrice user orderItems")
            .lean();
    }

    res.json({
        ...notification.toObject(),
        relatedData,
    });
});

// @desc    Mark a specific notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationsRead = asyncHandler(async (req, res) => {
    const notification = await Notifications.findById(req.params.id);

    if (notification) {
        if (notification.recipient.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("Not Authorized");
        }

        if (!notification.read) {
            notification.read = true;
            await notification.save();
        }

        res.json({ message: "Notification marked as read" });
    } else {
        res.status(404);
        throw new Error("Notification not found");
    }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read/all
// @access  Private
const markAllRead = asyncHandler(async (req, res) => {
    await Notifications.updateMany(
        { recipient: req.user._id, read: false },
        { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
});

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Private
const clearNotifications = asyncHandler(async (req, res) => {
    await Notifications.deleteMany({ recipient: req.user._id });
    res.json({ message: "Notifications cleared" });
});

export {
    getMyNotifications,
    markNotificationsRead,
    markAllRead,
    clearNotifications,
    getNotificationDetails
};
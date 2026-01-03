import asyncHandler from 'express-async-handler';
import Notifications from "../models/notificationsModel.js"

const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notifications.find({ recipient: req.user._id }).sort({ createdAt: -1 })
    res.json(notifications)
})

const markNotificationsRead = asyncHandler(async (req, res) => {
    const notifications = await Notifications.findById(req.params.id)

    if (notifications) {
        if (notifications.recipient.toString() !== req.user._id.toString()) {
            res.status(401)
            throw new Error("Not Authorized")
        }
        notifications.read = true
        await notifications.save()
        res.json({ message: "Notification marked as read" })
    } else {
        res.status(404)
        throw new Error("Notification not found")
    }
})

const markAllRead = asyncHandler(async (req, res) => {
    await Notifications.updateMany(
        { recipient: req.user._id, read: false },
        { $set: { read: true } }
    )
    res.json({ message: "All notifications marked as read" })
})


const clearNotifications = asyncHandler(async (req, res) => {
    await Notifications.deleteMany({ recipient: req.user._id })
    res.json({ message: "Notifications cleared" })
})

export {
    getMyNotifications,
    markNotificationsRead,
    markAllRead,
    clearNotifications
}
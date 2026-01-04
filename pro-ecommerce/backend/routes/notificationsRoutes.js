import express from "express"
import {
    getMyNotifications,
    clearNotifications,
    markAllRead,
    markNotificationsRead,
    getNotificationDetails,
    deleteSingleNotifications
} from "../controllers/notificationsController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/")
    .get(protect, getMyNotifications)
    .delete(protect, clearNotifications)


router.route("/read-all").put(protect, markAllRead)
router.route("/:id/read").put(protect, markNotificationsRead)
router.route("/:id")
    .get(protect, getNotificationDetails)
    .delete(protect, deleteSingleNotifications)

export default router
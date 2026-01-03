import express from "express"
import {
    getMyNotifications,
    clearNotifications,
    markAllRead,
    markNotificationsRead
} from "../controllers/notificationsController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/")
    .get(protect, getMyNotifications)
    .delete(protect, clearNotifications)


router.route("/read-all").put(protect, markAllRead)
router.route("/:id/read").put(protect, markNotificationsRead)

export default router
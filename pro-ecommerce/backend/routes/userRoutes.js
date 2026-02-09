import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
    authUser,
    registerUser,
    logoutUser,
    getUserDetails,
    getUserById,
    authGoogleUser,
    getUserNavigation
} from '../controllers/userController.js'

const router = express.Router();

router.post('/', registerUser)
router.post('/login', authUser)
router.post('/google', authGoogleUser)

router.post('/logout', protect, logoutUser)
router.get('/admin', protect, admin, getUserDetails)
router.get('/admin/customers/:id/navigation', protect, admin, getUserNavigation)
router.get('/admin/customers/:id', protect, admin, getUserById)



export default router
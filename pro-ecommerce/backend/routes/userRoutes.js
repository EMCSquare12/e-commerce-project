import express from 'express'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
    authUser,
    registerUser,
    logoutUser,
    getUserDetails,
    getUserById,
    authGoogleUser
} from '../controllers/userController.js'

const router = express.Router();


router.get('/admin', protect, admin, getUserDetails)
router.post('/', protect, registerUser)
router.post('/logout', protect, logoutUser)
router.post('/login', protect, authUser)
router.post('/google', protect, authGoogleUser)
router.get('/admin/customers/:id', protect, admin, getUserById)



export default router
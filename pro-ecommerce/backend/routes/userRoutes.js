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
router.post('/', registerUser)
router.post('/logout', logoutUser)
router.post('/login', authUser)
router.post('/google', authGoogleUser)
router.get('/admin/customers/:id', admin, getUserById)



export default router
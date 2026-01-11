import express from 'express'

import {
    authUser, registerUser, logoutUser,
    getUserDetails,
} from '../controllers/userController.js'

const router = express.Router();


router.get('/admin', getUserDetails)
router.post('/', registerUser)
router.post('/logout', logoutUser)
router.post('/login', authUser)

export default router
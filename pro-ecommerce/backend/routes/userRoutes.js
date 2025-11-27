import express from 'express'

import {
    authUser, registerUser, logoutUser,
} from '../controllers/userController.js'

const router = express.Router();

router.post('/', registerUser)
router.post('/logout', logoutUser)
router.post('/login', authUser)

export default router
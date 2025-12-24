import express from 'express'

import {
    authUser, registerUser, logoutUser,
    getUserAdmin,
} from '../controllers/userController.js'

const router = express.Router();


router.get('/admin', getUserAdmin)
router.post('/', registerUser)
router.post('/logout', logoutUser)
router.post('/login', authUser)

export default router
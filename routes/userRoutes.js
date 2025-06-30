import express from 'express'
import { changeUserStatus, editUser, getAllUsers, getUser, loginUser, registerUser } from '../controllers/userController.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'
import { adminAuth } from '../middlewares/adminAuthMiddleware.js'

export const userRoutes = express.Router()

userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.get('/getAll', adminAuth, getAllUsers)
userRoutes.get('/getUser', userAuth, getUser)
userRoutes.put('/editUser', userAuth, editUser)
userRoutes.put('/changeStatus', adminAuth, changeUserStatus)
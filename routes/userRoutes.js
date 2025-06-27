import express from 'express'
import { editUser, getUser, loginUser, registerUser } from '../controllers/userController.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const userRoutes = express.Router()

userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.post('/getUser', userAuth, getUser)
userRoutes.put('/editUser', userAuth, editUser)
import express from 'express'
import { forgotPassword, resetPassword } from '../controllers/passwordController.js'

export const passwordRoutes = express.Router()

passwordRoutes.post("/forgot-password", forgotPassword)
passwordRoutes.post("/reset-password", resetPassword)

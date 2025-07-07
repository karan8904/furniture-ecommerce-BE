import express from 'express'
import { checkoutSession } from '../controllers/paymentController.js';

export const paymentRoutes = express.Router()

paymentRoutes.post('/checkout-session', checkoutSession);
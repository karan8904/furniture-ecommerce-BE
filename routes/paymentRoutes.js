import express from 'express'
import { basePlanCheckout, checkoutSession } from '../controllers/paymentController.js';
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const paymentRoutes = express.Router()

paymentRoutes.post('/checkout-session', userAuth, checkoutSession);
paymentRoutes.post('/getSubscription', userAuth, basePlanCheckout)
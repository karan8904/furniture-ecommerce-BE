import express from 'express'
import { userAuth } from '../middlewares/userAuthMiddleware.js'
import { cancelSubscription, confirmSubscription, getSubscriptionDetails } from '../controllers/subscriptionController.js'

export const subscriptionRoutes = express.Router()

subscriptionRoutes.get("/confirm/:id", userAuth, confirmSubscription)
subscriptionRoutes.get("/getDetails/:id", userAuth, getSubscriptionDetails)
subscriptionRoutes.put("/cancelSubscription/:id", userAuth, cancelSubscription)
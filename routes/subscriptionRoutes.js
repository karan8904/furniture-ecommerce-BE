import express from 'express'
import { userAuth } from '../middlewares/userAuthMiddleware.js'
import { confirmSubscription } from '../controllers/subscriptionController.js'

export const subscriptionRoutes = express.Router()

subscriptionRoutes.get("/confirm/:id", userAuth, confirmSubscription)
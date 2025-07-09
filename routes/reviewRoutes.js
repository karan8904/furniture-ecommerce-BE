import express from 'express'
import { createReview, getReviews } from '../controllers/reviewController.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const reviewRoutes = express.Router()

reviewRoutes.get("/get/:productID", getReviews)
reviewRoutes.post("/post", userAuth, createReview)
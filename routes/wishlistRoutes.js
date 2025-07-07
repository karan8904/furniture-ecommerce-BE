import express from 'express'
import { userAuth } from '../middlewares/userAuthMiddleware.js'
import { addToWishlist, getFromWishlist, removeFromWishlist } from '../controllers/wishlistController.js'

export const wishlistRoutes = express.Router()

wishlistRoutes.get("/get", userAuth, getFromWishlist)
wishlistRoutes.post("/add", userAuth, addToWishlist)
wishlistRoutes.put("/remove/:id", userAuth, removeFromWishlist)
import express from 'express'
import { addToCart, decreaseQuantity, getCartProducts, increaseQuantity, removeFromCart } from '../controllers/cartController.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const cartRoutes = express.Router()

cartRoutes.get("/get", userAuth, getCartProducts)
cartRoutes.post("/add", userAuth, addToCart)
cartRoutes.put("/increaseQty", userAuth, increaseQuantity)
cartRoutes.put("/decreaseQty", userAuth, decreaseQuantity)
cartRoutes.delete("/remove/:id", userAuth, removeFromCart)
import express from 'express'
import { addToCart, decreaseQuantity, getCartProducts, increaseQuantity, removeFromCart } from '../controllers/cartController.js'

export const cartRoutes = express.Router()

cartRoutes.get("/get/:userID", getCartProducts)
cartRoutes.post("/add", addToCart)
cartRoutes.put("/increaseQty", increaseQuantity)
cartRoutes.put("/decreaseQty", decreaseQuantity)
cartRoutes.delete("/remove/:id", removeFromCart)
import express from 'express'
import { changeStatus, createOrder, getOrders } from '../controllers/orderController.js'
import { adminAuth } from '../middlewares/adminAuthMiddleware.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const orderRoutes = express.Router()

orderRoutes.get("/get", adminAuth, getOrders)
orderRoutes.post("/create", userAuth,createOrder)
orderRoutes.put("/changeStatus", adminAuth, changeStatus)
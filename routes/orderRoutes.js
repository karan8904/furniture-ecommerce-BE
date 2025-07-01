import express from 'express'
import { changeStatus, createOrder, dailyOrdersCount, getMyOrders, getOrders, getThisMonthOrdersCount, orderStatusCount, searchOrders } from '../controllers/orderController.js'
import { adminAuth } from '../middlewares/adminAuthMiddleware.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const orderRoutes = express.Router()

orderRoutes.get("/get", adminAuth, getOrders)
orderRoutes.post("/create", userAuth,createOrder)
orderRoutes.put("/changeStatus", adminAuth, changeStatus)
orderRoutes.get("/getMyOrders", userAuth, getMyOrders)
orderRoutes.get("/getThisMonthOrdersCount", adminAuth, getThisMonthOrdersCount)
orderRoutes.get("/getDailyOrdersCount", adminAuth, dailyOrdersCount)
orderRoutes.get("/getOrderStatusCount/:time", adminAuth, orderStatusCount)
orderRoutes.get("/search/:query", adminAuth, searchOrders)
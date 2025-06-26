import express from 'express'
import { changeStatus, createOrder, getOrders } from '../controllers/orderController.js'

export const orderRoutes = express.Router()

orderRoutes.get("/get", getOrders)
orderRoutes.post("/create", createOrder)
orderRoutes.put("/changeStatus", changeStatus)
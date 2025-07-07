import express from 'express'
import { adminAuth } from '../middlewares/adminAuthMiddleware.js'
import { addCharge, deleteCharge, getCharges, updateCharge } from '../controllers/chargesController.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const chargesRoutes = express.Router()

chargesRoutes.get("/get", userAuth, getCharges)
chargesRoutes.post("/create", adminAuth, addCharge)
chargesRoutes.put("/edit", adminAuth, updateCharge)
chargesRoutes.delete("/delete/:id", adminAuth, deleteCharge)
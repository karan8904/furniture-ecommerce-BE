import express from 'express'
import { createAddress, getAddresses } from '../controllers/addressController.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const addressRoutes = express.Router()

addressRoutes.post("/create", userAuth, createAddress)
addressRoutes.get("/get/:id", userAuth, getAddresses)
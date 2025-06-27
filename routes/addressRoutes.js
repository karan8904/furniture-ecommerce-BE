import express from 'express'
import { createAddress, deleteAddress, editAddress, getAddresses, getSingleAddress } from '../controllers/addressController.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'

export const addressRoutes = express.Router()

addressRoutes.post("/create", userAuth, createAddress)
addressRoutes.get("/get/:id", userAuth, getAddresses)
addressRoutes.get("/getSingle/:id", userAuth, getSingleAddress)
addressRoutes.put("/edit/:id", userAuth, editAddress)
addressRoutes.delete("/delete/:id", userAuth, deleteAddress)
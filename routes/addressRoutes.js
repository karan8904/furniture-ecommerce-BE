import express from 'express'
import { createAddress, getAddresses } from '../controllers/addressController.js'

export const addressRoutes = express.Router()

addressRoutes.post("/create", createAddress)
addressRoutes.get("/get/:id", getAddresses)
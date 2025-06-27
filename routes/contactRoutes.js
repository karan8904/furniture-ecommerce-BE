import express from 'express'
import { createContact, deleteContacts, getContacts } from '../controllers/contactController.js'
import { adminAuth } from '../middlewares/adminAuthMiddleware.js'

export const contactRoutes = express.Router()

contactRoutes.get("/", adminAuth, getContacts)
contactRoutes.post("/create", createContact)
contactRoutes.delete("/delete/:id", adminAuth, deleteContacts)
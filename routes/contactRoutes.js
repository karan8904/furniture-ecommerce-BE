import express from 'express'
import { createContact, deleteContacts, getContacts } from '../controllers/contactController.js'

export const contactRoutes = express.Router()

contactRoutes.get("/", getContacts)
contactRoutes.post("/create", createContact)
contactRoutes.delete("/delete/:id", deleteContacts)